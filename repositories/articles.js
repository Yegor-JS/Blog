const fs = require("fs");
const Repository = require("./repository");
const picturesRepo = require("./pictures");

class ArticlesRepositories extends Repository {
  async getTitles() {
    return JSON.parse(
      await fs.promises.readFile(this.filename, {
        encode: "utf8",
      })
    );
  }

  async insertPictures(text) {
    const regEx = /(?:\r\n)?{picture id:\s*([a-f0-9]+)\}(?:\r\n)?/g;

    let matches;

    while ((matches = regEx.exec(text)) !== null) {
      const id = matches[1];
      //Точно ли тут вообще нужен picturesRepo, или можно использовать this?
      const picture = await picturesRepo.getOneBy({ id });

      const pictureTag = `<figure>\r\n<img src="data:image/png;base64, ${picture.imageBody}"/>\r\n</figure>`;
      const matchesRegExp = new RegExp(matches[0], "g");
      text = text.replace(matchesRegExp, pictureTag);
    }

    return text;
  }

  // WHAT GETS INSERTED
  //insertIntoText(`\r\n{picture id: ${text}}\r\n`);

  async removePictures(text) {
    // debugger;

    const regEx =
      /<figure>[\s\S]*?<img src="data:image\/png;base64,\s*(.+)"\/>[\s\S]*?<\/figure>/;

    let matches;

    while ((matches = regEx.exec(text)) !== null) {
      const imageBody = matches[1];
      const picture = await picturesRepo.getOneBy({ imageBody });
      const pictureId = `\r\n{picture id: ${picture.id}}\r\n`;

      // const matchesRegExp = new RegExp(matches[0], "g")
      text = text.replaceAll(matches[0], pictureId);
    }

    return text;
  }

  // Тут мы получаем title и body в качестве attrs. В body есть \r\n. Заменить на </p> при нажатии на enter при сохранении? нажатии на enter?
  async create(attrs) {
    const gotAll = await this.getAll();
    attrs.id = this.randomId();
    let oldBody = attrs.body;
    oldBody = oldBody.replace(/<\/p>\r\n<p>/g, "</p><p>");

    attrs.body = await this.insertPictures(oldBody);

    gotAll.push(attrs);
    await this.writeAll(gotAll);
  }

  async update(id, attrs) {
    const records = await this.getAll();
    const record = records.find((record) => record.id === id);

    if (!record) {
      throw new Error(`Item with id ${id} not found`);
    }

    attrs.body = await this.insertPictures(attrs.body);
    Object.assign(record, attrs);
    await this.writeAll(records);
  }
  async getCommentKeyById(article, commentId) {
    const comments = article.comments;
    let commentKey;
    Object.keys(comments).forEach(function (key) {
      if (comments[key].commentId == commentId) {
        commentKey = key;
      }
    });
    if (!commentKey) {
      throw new Error(`Comment with id ${commentId} not found`);
    }
    return commentKey;
  }

  async changeCommentRating(articleId, commentId, userId, upvotesOrDownvotes) {
    //upvotesOrDownvotes is expected to be either "upvotes" or "downvotes"

    const article = await this.getOneBy({ id: articleId });
    const commentKey = await this.getCommentKeyById(article, commentId);
    const whoVoted = article.comments[commentKey].whoVoted;

    const deleteElementFromArray = (source, elementToDelete) => {
      const filteredVotes = source.filter(
        (element) => element !== elementToDelete
      );
      return filteredVotes;
    };

    const isInAnyList = () => {
      for (let obj in whoVoted) {
        if (whoVoted[obj].includes(userId)) {
          return true;
        }
      }
      return false;
    };

    const isInTargetList = () => {
      return whoVoted[upvotesOrDownvotes].includes(userId);
    };
    
    if (isInTargetList()) {
      whoVoted[upvotesOrDownvotes] = deleteElementFromArray(
        whoVoted[upvotesOrDownvotes],
        userId
      );
    } else if (isInAnyList) {
      for (let obj in whoVoted) {
        whoVoted[obj] = deleteElementFromArray(whoVoted[obj], userId);
      }
      whoVoted[upvotesOrDownvotes].push(userId);
    } else {
      whoVoted[upvotesOrDownvotes].push(userId);
    }

    const changes = article;
    return changes;
  }
}

module.exports = new ArticlesRepositories("articles.json");

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

  async getCommentById(articleId, commentId) {
    const article = await this.getOneBy({ id: articleId });
    const comments = article.comments;
    //ТУТ НЕ РАБОАТЕТ. посмотреть повнимательнее снипет, с ним может выйти

    var obj = {
      first: "John",
      last: "Doe"
    };
    
    //
    //	Visit non-inherited enumerable keys
    //
    Object.keys(obj).forEach(function(key) {
    
      console.log(key, obj[key]);
    
    });

    for (let comment in comments) {
      console.log(comment.commentId);

      let found = true;

      for (let key in commentId) {
        if (comment[key] !== commentId[key]) {
          found = false;
        }
      }
      if (found) {
        return comment;
      }
    }

    // async getOneBy(filters) {
    //   const records = await this.getAll();

    //   for (let record of records) {
    //     let found = true;

    //     for (let key in filters) {
    //       if (record[key] !== filters[key]) {
    //         found = false;
    //       }
    //     }

    //     if (found) {
    //       return record;
    //     }
    //   }
    // }
  }
}

module.exports = new ArticlesRepositories("articles.json");

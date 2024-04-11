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
    const regEx = /\{\s*'picture id'\s*:\s*([a-f0-9]+)\s*\}/g;

    let matches;

    while ((matches = regEx.exec(text)) !== null) {
      const id = matches[1];
      const picture = await picturesRepo.getOneBy({ id });

      const pictureTag = `
      <figure>
      <img src="data:image/png;base64, ${picture.imageBody}"/>
      </figure>
      `;
      const matchesRegExp = new RegExp(matches[0], "g");
      text = text.replace(matchesRegExp, pictureTag);
    }

    return text;
  }

  async removePictures(text, inputPicturesRepo = picturesRepo) {
    // debugger;
    console.log((await inputPicturesRepo.getAll()).length);

    const regEx =
      /<figure>[\s\S]*?<img src="data:image\/png;base64,\s*(.+)"\/>[\s\S]*?<\/figure>/g;

    let matches;

    while ((matches = regEx.exec(text)) !== null) {
      const imageBody = matches[1];
      console.log(matches[0]);
      const picture = await inputPicturesRepo.getOneBy({ imageBody });
      console.log(picture);
      const pictureId = `\r\n{'picture id' : ${picture.id} }\r\n`;

      const matchesRegExp = new RegExp(matches[0], "g");
      text = text.replace(matchesRegExp, pictureId);
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
}

module.exports = new ArticlesRepositories("articles.json");

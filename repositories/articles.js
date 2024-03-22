const fs = require('fs');
const Repository = require('./repository');

class ArticlesRepositories extends Repository {
    async getTitles() {
        return JSON.parse(
            await fs.promises.readFile(this.filename, {
                encode: 'utf8'
            })
        );
    };

    // Тут мы получаем title и body в качестве attrs. В body есть \r\n. Заменить на </p> при нажатии на enter при сохранении? нажатии на enter?
    async create(attrs) {
        const gotAll = await this.getAll();
        attrs.id = this.randomId();
        // const oldBody = attrs.body
        // attrs.body = oldBody.replace(/<\/p>\r\n<p>/g, '</p><p>');
        gotAll.push(attrs);
        await this.writeAll(gotAll);
    }
}

module.exports = new ArticlesRepositories('articles.json');

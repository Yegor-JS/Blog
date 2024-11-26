const express = require('express');
const articlesRepo = require('../../repositories/articles');
const usersRepo = require('../../repositories/users')
const router = express.Router();
const adminPanel = require('../../views/admin/admin');
const createArticle = require('../../public/admin/create');
const editArticle = require('../../public/admin/edit');
const { requireAuth, requireAdmin } = require('../middlewares');
const path = require("path");
const { addLinesToArticle } = require('../../views/helpers');

router.get("/admin", requireAuth, requireAdmin, async (req, res) => {
    const articles = await articlesRepo.getAll();

    const userId = req.session.userId;
    const user = await usersRepo.getOneBy({ id: userId });

    res.send(adminPanel(user, { articles }));
});

router.get("/admin/create", requireAuth, requireAdmin, async (req, res) => {
    // const filePath = path.join(__dirname, "../../public/admin/create");
    // res.sendFile(filePath)

    const userId = req.session.userId;
    const user = await usersRepo.getOneBy({ id: userId });

    res.send(createArticle(user));
});

router.get('/admin/articles/:id/edit', requireAuth, requireAdmin, async (req, res) => {
    const id = req.params.id;
    const articleWithoutLines = await articlesRepo.getOneBy({ id });
    let article = addLinesToArticle(articleWithoutLines);
    article.body = await articlesRepo.removePictures(article.body)

    const userId = req.session.userId;
    const user = await usersRepo.getOneBy({ id: userId });

    res.send(editArticle(user, { article }));
}
);

router.post(
    "/admin/articles/:id/delete",
    requireAuth,
    requireAdmin,
    async (req, res) => {
      const id = req.params.id;
      await articlesRepo.delete(id);
      res.redirect("/admin");
    }
  );

// router.get('/admin/articles/:id/edit', requireAuth, requireAdmin, async (req, res) => {
//     const id = req.params.id;
//     const article = await articlesRepo.getOneBy({ id });
//     res.send(editArticle({ article }));
// }
// );


module.exports = router;
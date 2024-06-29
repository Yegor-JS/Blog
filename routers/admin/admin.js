const express = require('express');
const articlesRepo = require('../../repositories/articles');
const router = express.Router();
const adminPanel = require('../../views/admin/admin');
// const postArticle = require('../../views/admin/create');
const editArticle = require('../../public/admin/edit');
const { requireAuth, requireAdmin } = require('../middlewares');
const path = require("path");
const { addLinesToArticle } = require('../../views/helpers');

router.get("/admin", requireAuth, requireAdmin, async (req, res) => {
    const articles = await articlesRepo.getAll();
    res.send(adminPanel({ articles }));
});

router.get("/admin/create.html", requireAuth, requireAdmin, async (req, res) => {
    const filePath = path.join(__dirname, "../../public/admin/create.html");
    res.sendFile(filePath)
});

router.get('/admin/articles/:id/edit', requireAuth, requireAdmin, async (req, res) => {
    const id = req.params.id;
    const articleWithoutLines = await articlesRepo.getOneBy({ id });
    let article = addLinesToArticle(articleWithoutLines);
    article.body = await articlesRepo.removePictures(article.body)
    res.send(editArticle({ article }));
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
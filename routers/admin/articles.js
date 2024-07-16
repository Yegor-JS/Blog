const express = require("express");
const articlesRepo = require("../../repositories/articles");
const router = express.Router();
const { requireAuth, requireAdmin } = require("../middlewares");
const { removeLinesFromArticle } = require("../../views/helpers");

router.post(
  "/admin/create.html",
  requireAuth,
  requireAdmin,
  async (req, res) => {
    const { title, body } = req.body;
    await articlesRepo.create({ title, body });
    res.redirect("/admin");
  }
);

router.post(
  "/admin/articles/:id/edit",
  requireAuth,
  requireAdmin,
  async (req, res) => {
    const articleWithLines = req.body;
    const changes = removeLinesFromArticle(articleWithLines);
    const id = req.params.id;
    try {
      await articlesRepo.update(id, changes);
    } catch (err) {
      return res.send(err, "Could not find item");
    }
    res.redirect("/admin");
  }
);

router.post(
  "/admin/articles/:articleId/comments/:commentId/delete",
  requireAuth,
  requireAdmin,
  async (req, res) => {
    const articleId = req.params.articleId;
    const commentId = req.params.commentId;
    const changes = await articlesRepo.getOneBy({ id: articleId });
    const commentKey = `comment-${commentId}`;

    if (!changes.comments[commentKey]) {
      return res.send("Could not find item");
    }
    delete changes.comments[commentKey];
    // Этот catch нифига не ловит, как и многие другие. Это надо бы исправить вообще
    try {
      await articlesRepo.update(articleId, changes);
    } catch (err) {
      return res.send(err, "Could not find item");
    }
    res.redirect(`/articles/${articleId}`);
  }
);

module.exports = router;

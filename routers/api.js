const express = require("express");
const articlesRepo = require("../repositories/articles");
const usersRepo = require("../repositories/users");
const router = express.Router();

const { requireAuth } = require('./middlewares');

router.get("/api/getArticles", async (req, res) => {
  allArticles = await articlesRepo.getAll();
  res.send(allArticles);
});

router.get("/api/identifyUser", async (req, res) => {
  if (req.session.userId) {
    const id = req.session.userId;
    const user = await usersRepo.getOneBy({ id });
    const { name, admin } = user;
    res.send({ name, admin });
  } else {
    res.send({ name: null });
  }
});

router.get(
  "/articles/:articleId/comments/:commentId/vote",
  requireAuth,
  async (req, res) => {
    const commentId = req.params.commentId;
    const articleId = req.params.articleId;

    const userId = req.session.userId;

    const article = await articlesRepo.changeCommentRating(
      articleId,
      commentId,
      userId,
      req.query.rating
    );
    articlesRepo.update(articleId, article);

    const commentKey = await articlesRepo.getCommentKeyById(article, commentId);

    res.send(article.comments[commentKey].commentRating);
  }
);

module.exports = router;

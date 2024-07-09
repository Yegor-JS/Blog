const express = require("express");
const articlesRepo = require("../repositories/articles");
const usersRepo = require("../repositories/users");
const article = require("../public/article");
const router = express.Router();

const app = express();

router.get("/api/getArticles", async (req, res) => {
  allArticles = await articlesRepo.getAll();
  res.send(allArticles);
});

// router.get('/api/identifyUser', async (req, res) => {
//     usersId = req.session.userId;
//     res.send({ usersId });
// });

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
  "/api/get-comment-rating/:commentId/:articleId",
  async (req, res) => {
    const commentId = req.params.commentId;
    const articleId = req.params.articleId;

    const article = await articlesRepo.getOneBy({ id: articleId });
    const commentKey = await articlesRepo.getCommentKeyById(article, commentId);
    res.send(article.comments[commentKey].commentRating)
  }
);

module.exports = router;

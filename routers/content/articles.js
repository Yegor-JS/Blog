const express = require("express");
const router = express.Router();
const displayArticle = require("../../views/content/article");
const articlesRepo = require("../../repositories/articles");

router.get("/articles/:id", async (req, res) => {
  const id = req.params.id;
  const article = await articlesRepo.getOneBy({ id });
  res.send(displayArticle(article));
});

module.exports = router;

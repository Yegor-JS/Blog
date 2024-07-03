const express = require("express");
const router = express.Router();
const displayArticle = require("../../public/article");
const articlesRepo = require("../../repositories/articles");
const usersRepo = require("../../repositories/users");
const { requireAuth } = require("../middlewares");

router.get("/articles/:id", async (req, res) => {
  const id = req.params.id;
  const article = await articlesRepo.getOneBy({ id });
  res.send(displayArticle({ article }));
});

// POSTING A COMMENT
// ADD VALIDATION THAT THERE'S A COMMENT TO ADD
router.post("/articles/:id", requireAuth, async (req, res) => {
  try {
    //ADD DATE
    const articleId = req.params.id;
    const changes = await articlesRepo.getOneBy({ id: articleId });
    const commentBody = req.body.comment;
    const commentId = articlesRepo.randomId();
    const commentDate = Date();
    //ADD USERNAME
    const userId = req.session.userId;
    const user = await usersRepo.getOneBy({ id: userId });
    const { name } = user;
    const commentAuthor = name;
    //ADD THE REST
    const commentRating = { upvotes: 0, downvotes: 0 };
    //PUSH
    if (!changes.comments) {
      changes.comments = {};
    }

    let commentCount = 1;
    commentCount += Object.keys(changes.comments).length;

    changes.comments["comment" + commentCount] = {
      commentBody,
      commentId,
      commentDate,
      commentAuthor,
      commentRating,
    };

    await articlesRepo.update(articleId, changes);
  } catch (err) {
    return res.send(err, "Something went wrong");
  }

  res.redirect(req.originalUrl);
});

//ADD RATING

router.post(
  "/articles/:articleId/comments/:commentId/vote",
  requireAuth,
  async (req, res) => {
    const articleId = req.params.articleId;
    const commentId = req.params.commentId;

    const userId = req.session.userId;

    const changes = await articlesRepo.changeCommentRating(
      articleId,
      commentId,
      userId,
      req.query.rating
    );
    articlesRepo.update(articleId, changes);
    res.status(204).send();
  }
);

// router.post(
//   "/admin/articles/:id/edit",
//   requireAuth,
//   requireAdmin,
//   async (req, res) => {
//     const articleWithLines = req.body;
//     const changes = removeLinesFromArticle(articleWithLines);
//     const id = req.params.id;
//     try {
//       await articlesRepo.update(id, changes);
//     } catch (err) {
//       return res.send(err, "Could not find item");
//     }
//     res.redirect("/admin");
//   }
// );

module.exports = router;

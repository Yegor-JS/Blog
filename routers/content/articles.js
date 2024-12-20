const express = require("express");
const router = express.Router();

const displayArticle = require("../../public/article");
const index = require("../../public/index");

const articlesRepo = require("../../repositories/articles");
const usersRepo = require("../../repositories/users");
const { requireAuth, requireLength } = require("../middlewares");

router.get("/", async (req, res) => {
  const userId = req.session.userId;
  const user = await usersRepo.getOneBy({ id: userId });

  res.send(index(user));
});

router.get("/articles/:id", async (req, res) => {
  const id = req.params.id;
  const article = await articlesRepo.getOneBy({ id });
  const userId = req.session.userId;
  const user = await usersRepo.getOneBy({ id: userId });

  res.send(displayArticle({ article, user }));
});

// POSTING A COMMENT
// ADD VALIDATION THAT THERE'S A COMMENT TO ADD
router.post("/articles/:id", requireAuth, requireLength, async (req, res) => {
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
    //ADD RATING
    const commentRating = { upvotes: [], downvotes: [] };
    //PUSH
    if (!changes.comments) {
      changes.comments = {};
    }

    // РАНЬШЕ КЛЮЧ КОММЕНТАРИЯ НЕ СОДЕРЖАЛ В СЕБЕ ID. ТЕПЕРЬ СОДЕРЖИТ, И МОЖНО УПРОСТИТЬ ЛОГИКУ ПОИСКА НУЖНОГО КОММЕНТАРИЯ ПО ID, Т.К. ОН ТЕПЕРЬ СОДЕРЖИТСЯ В КЛЮЧЕ.
    // В НЕКОТОРЫХ МЕСТАХ ЛОГИКА МОЖЕТ БЫТЬ ВСЕ ЕЩЕ СТАРОЙ. К ТОМУ ЖЕ НЕТ УВЕРЕННОСТИ, ЧТО МНЕ ВООБЩЕ НУЖНО ХРАНИТЬ ID САМ ПО СЕБЕ, ОТДЕЛЬНО ОТ КЛЮЧА
    changes.comments["comment-" + commentId] = {
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

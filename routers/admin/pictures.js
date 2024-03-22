const express = require("express");
const picturesRepo = require("../../repositories/pictures");
const router = express.Router();
const { requireAuth, requireAdmin } = require("../middlewares");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

router.post(
  "/images/new",
  upload.single("image"),
  requireAuth,
  requireAdmin,
  async (req, res) => {
    const imageBody = req.file.buffer.toString("base64");
    const name = req.file.originalname;
    const uploadedImage = await picturesRepo.create({ imageBody, name });
    const id = await uploadedImage.id;
    console.log(req);

    picturesRepo.getOneBy({ id });
    res.send(id);

    // async (req, res) => {
    //   const { title, body } = req.body;
    //   await articlesRepo.create({ title, body });
    //   res.redirect("/admin");
    // }
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

// router.post(
//   "/admin/articles/:id/delete",
//   requireAuth,
//   requireAdmin,
//   async (req, res) => {
//     const id = req.params.id;
//     await articlesRepo.delete(id);
//     res.redirect("/admin");
//   }
// );

module.exports = router;

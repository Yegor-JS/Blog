const usersRepo = require("../repositories/users");
const { validationResult } = require("express-validator");

module.exports = {
  requireAuth(req, res, next) {
    if (!req.session.userId) {
      return res.redirect("/signin");
    }
    next();
  },

  async requireAdmin(req, res, next) {
    const id = req.session.userId;
    const user = await usersRepo.getOneBy({ id });
    if (!user.admin) {
      return res.redirect("/signin");
    }
    next();
  },

  async requireLength(req, res, next) {
    const comment = req.body.comment;
    if (comment.length < 1) {
      return res
        .status(400)
        .send({ error: "Your comment must contain at least some characters" });
    }
    if (comment.length > 2000) {
      return res.status(400).send({
        error:
          "Your comment is too long. Please, keep it no longer than 2000 characters",
      });
    }
    if (!comment.length) {
      return res.status(500).send({ error: "Something went wrong" });
    }
    next();
  },

  handleErrors(templateFunc, dataCb) {
    return async (req, res, next) => {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        let data = {};
        if (dataCb) {
          data = await dataCb(req);
        }

        return res.send(templateFunc({ errors, ...data }));
      }
      next();
    };
  },
};

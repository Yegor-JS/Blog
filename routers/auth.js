const express = require("express");

const { handleErrors } = require("./middlewares");
const usersRepo = require("../repositories/users");
const signupTemplate = require("../views/auth/signup");
const signinTemplate = require("../views/auth/signin");
const {
  requireEmail,
  requireName,
  requirePassword,
  requirePasswordConfirmation,
  requireEmailExists,
  requireValidPasswordForUser,
} = require("./validators");

const router = express.Router();

router.get("/signup", (req, res) => {
  if (!req.session.userId) {
    res.send(signupTemplate({}));
  } else {
    res.send("you're already signed up");
  }
});

router.post(
  "/signup",
  [requireEmail, requirePassword, requireName, requirePasswordConfirmation],
  handleErrors(signupTemplate),
  async (req, res) => {
    const { name, email, password } = req.body;
    const user = await usersRepo.create({ name, email, password });

    req.session.userId = user.id;

    res.redirect("/");
  }
);

router.get("/signout", (req, res) => {
  req.session = null;
  res.send("Logged out");
});

router.get("/signin", async (req, res) => {
  res.send(signinTemplate({}));
});

router.post(
  "/signin",
  [requireEmailExists, requireValidPasswordForUser],
  handleErrors(signinTemplate),
  async (req, res) => {
    const { email } = req.body;
    const user = await usersRepo.getOneBy({ email });

    req.session.userId = user.id;

    res.redirect("/");
  }
);

module.exports = router;

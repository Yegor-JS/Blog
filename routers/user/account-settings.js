const express = require("express");

const { requireAuth, handleErrors } = require("../middlewares");
const usersRepo = require("../../repositories/users");
const changePasswordTemplate = require("../../views/user/change-password");
const changeNameTemplate = require("../../views/user/change-name");
const changeEmailTemplate = require("../../views/user/change-email");
const accountSettingsTemplate = require("../../views/user/account-settings");
const {
  requireOldPassword,
  requireNewPassword,
  requireNewPasswordConfirmation,
  requireName,
  requireEmail,
} = require("../validators");

const router = express.Router();

router.get("/account-settings", requireAuth, async (req, res) => {
  const userId = req.session.userId;
  const user = await usersRepo.getOneBy({ id: userId });

  res.send(accountSettingsTemplate(user));
});

router.get("/user/change-password", requireAuth, async (req, res) => {
    const userId = req.session.userId;
    const user = await usersRepo.getOneBy({ id: userId });
  
  res.send(changePasswordTemplate(user, {}));
});

router.post(
  "/user/change-password",
  [requireOldPassword, requireNewPassword, requireNewPasswordConfirmation],
  handleErrors(changePasswordTemplate),
  requireAuth,
  async (req, res) => {
    const newPassword = req.body.newPassword;
    const id = req.session.userId;
    await usersRepo.updatePassword(id, newPassword);
    res.redirect("/account-settings");
  }
);

router.get("/user/change-name", requireAuth, async (req, res) => {
  const userId = req.session.userId;
  const user = await usersRepo.getOneBy({ id: userId });

  res.send(changeNameTemplate(user, {}));
});

router.post(
  "/user/change-name",
  requireName,
  handleErrors(changeNameTemplate),
  requireAuth,
  async (req, res) => {
    const changes = req.body;
    const id = req.session.userId;
    try {
      await usersRepo.update(id, changes);
    } catch (err) {
      return res.send(err, "Could not find user");
    }
    res.redirect("/account-settings");
  }
);

router.get("/user/change-email", requireAuth, async (req, res) => {
  const userId = req.session.userId;
  const user = await usersRepo.getOneBy({ id: userId });

  res.send(changeEmailTemplate(user, {}));
});

router.post(
  "/user/change-email",
  requireEmail,
  handleErrors(changeEmailTemplate),
  requireAuth,
  async (req, res) => {
    const changes = req.body;
    const id = req.session.userId;
    try {
      await usersRepo.update(id, changes);
    } catch (err) {
      return res.send(err, "Could not find user");
    }
    res.redirect("/account-settings");
  }
);

module.exports = router;

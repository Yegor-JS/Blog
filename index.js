const express = require("express");
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
// const articlesRepo = require('./repositories/articles');
const adminArticlesRouter = require("./routers/admin/articles");
const adminRouter = require("./routers/admin/admin");
const apiRouter = require("./routers/api");
const authRouter = require("./routers/auth");
const userRouter = require("./routers/user/account-settings");
const articleRouter = require("./routers/content/articles");
const picturesRouter = require("./routers/admin/pictures");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieSession({ keys: ["36t45ergfd"], maxAge: 24 * 60 * 60 * 10000 }));
app.use(adminArticlesRouter);
app.use(adminRouter);
app.use(express.static("./public"));

app.use(apiRouter);
app.use(authRouter);
app.use(userRouter);
app.use(articleRouter);
app.use(picturesRouter);

app.listen(3000, () => {});

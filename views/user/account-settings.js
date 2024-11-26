const layout = require("../layout");

module.exports = (user) => {
  return layout(user, {
    content: `
    <body>

    <div>
        <a href="/user/change-email"> change email</a>
    </div>

    <div>
        <a href="/user/change-name"> change name</a>
    </div>

    <div>
    <a href="/user/change-password"> change password</a>
    </div>

    </body>
    `,
  });
};

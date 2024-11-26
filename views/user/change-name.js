const layout = require("../layout");
const { getError } = require("../helpers");

module.exports = (user, { errors }) => {
  return layout(user, {
    content: `
    <!DOCTYPE html>
    <html lang="en">
    <head>
    </head>
    <body>
    <div class="container">
    <div class="columns is-centered">
      <div class="column is-one-quarter">
        <form method="POST">
          <h1 class="title">Change username</h1>
          <div class="field">
          <label class="label">Enter new username:</label>
          <input class="input" placeholder="your new username" name="name" type="name" />
          <p>${getError(errors, "name")}</p>
          <button>Submit</button>
        </form>
      </div>
      <div>
      <a href="/account-settings">Back to account settings</a>
</div>
    </div>
  </div>
    </body>
    </html>
    `,
  });
};

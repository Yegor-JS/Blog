const layout = require("../layout");
const { getError } = require("../helpers");

module.exports = (user, { errors }) => {
  return layout(user, {
    content: `
    <body>
    <div class="container">
    <div class="columns is-centered">
      <div class="column is-one-quarter">
        <form method="POST">
          <h1 class="title">Change email</h1>
          <div class="field">
          <label class="label">Enter new email:</label>
          <input class="input" placeholder="new@email.com" name="email" type="email" />
          <p>${getError(errors, "email")}</p>
          <button>Submit</button>
        </form>
      </div>
      <div>
      <a href="/account-settings">Back to account settings</a>
</div>
    </div>
  </div>
    </body>
    `,
  });
};

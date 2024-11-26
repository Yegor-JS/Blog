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
          <h1 class="title">Change the password</h1>
          <div class="field">
          <label class="label">Current password</label>
          <input class="input" placeholder="Password" name="password" type="password" />
          <p>${getError(errors, "password")}</p>

        </div>
          <div class="field">
            <label class="label">New password</label>
            <input class="input" placeholder="New Password" name="newPassword" type="password" />
            <p>${getError(errors, "newPassword")}</p>
          </div>
          <div class="field">
            <label class="label">New password confirmation</label>
            <input class="input" placeholder="Password Confirmation" name="passwordConfirmation" type="password" />
            <p>${getError(errors, "passwordConfirmation")}</p>

          </div>
          <button class="button is-primary">Submit</button>
        </form>
        <a href="/signin">Have an account? Sign In</a>
      </div>
    </div>
  </div>
    </body>
    `,
  });
};

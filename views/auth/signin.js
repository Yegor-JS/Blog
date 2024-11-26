const layout = require("../layout-bare");
const { getError } = require("../helpers");

module.exports = ({ errors }) => {
  return layout({
    content: `
      <div>
        <div>
          <div>
            <form method="POST">
              <h1>Sign in</h1>
              <div>
                <label class="label">Email</label>
                <input required class="input" placeholder="Email" name="email" />
                <p>${getError(errors, "email")}</p>
              </div>
              <div>
                <label>Password</label>
                <input required class="input" placeholder="Password" name="password" type="password" />
                <p>${getError(errors, "password")}</p>
              </div>
              <button>Submit</button>
            </form>
            <a href="/signup">Need an account? Sign Up</a>
          </div>
        </div>
      </div>
    `,
  });
};

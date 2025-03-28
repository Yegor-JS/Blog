const layout = require('../layout-bare');
const { getError } = require('../helpers');

module.exports = ({ errors }) => {
  return layout({
    content: `
      <div class="container">
        <div class="columns is-centered">
          <div class="column is-one-quarter">
            <form method="POST">
              <h1 class="title">Sign Up</h1>
              <div class="field">
                <label class="label">Name</label>
                <input class="input" placeholder="Name" name="name" />
                <p>${getError(errors, 'name')}</p>
              </div>
              <div class="field">
                <label class="label">Email</label>
                <input class="input" placeholder="Email" name="email" />
                <p>${getError(errors, 'email')}</p>
              </div>
              <div class="field">
                <label class="label">Password</label>
                <input class="input" placeholder="Password" name="password" type="password" />
                <p>${getError(errors, 'password')}</p>
              </div>
              <div class="field">
                <label class="label">Password Confirmation</label>
                <input class="input" placeholder="Password Confirmation" name="passwordConfirmation" type="password" />
                <p>${getError(errors, 'passwordConfirmation')}</p>
              </div>
              <button class="button is-primary">Submit</button>
            </form>
            <a href="/signin">Have an account? Sign In</a>
          </div>
        </div>
      </div>
    `
  });
};

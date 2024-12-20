const layout = require("../layout");

module.exports = (user, { articles }) => {
  const renderedArticles = articles
    .map((article) => {
      return `
            <tr>
              <td>${article.title}</td>
                  <td>
                  <a href="/admin/articles/${article.id}/edit">
                  <button class="button is-link">
                    Edit
                  </button>
                </a>
              </td>
              <td>
                <form method="POST" action="/admin/articles/${article.id}/delete">
                  <button >Delete</button>
                </form>
              </td>
            </tr>
          `;
    })
    .join("");

  return layout(user, {
    content: `
    <div>
    <h1 class="subtitle">Articles</h1>  
  </div>
  <table class="table">
    <thead>
      <tr>
        <th>Title</th>
        <th>Edit</th>
        <th>Delete</th>
      </tr>
    </thead>
    <tbody>
      ${renderedArticles}
    </tbody>
  </table>
    <div>
    <a href="/admin/create">create a new article</a>
    </div>
    <div>
    <a href="/user/change-password">change the password</a>
    </div>
    </html>
    `,
  });
};
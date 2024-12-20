const layout = require("../views/layout");

module.exports = (user) => {

return layout(user, {
  content: `

    <div id="greetings"></div>

    <div id="articles-on-main">
    </div>
    <script src="./displayArticles.js"></script>`,
});
}
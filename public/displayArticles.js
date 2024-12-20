// // Identify User
// let user = {};
// const indentifyUser = async () => {
//   const response = await fetch("/api/identifyUser");
//   const data = await response.json();
//   if (data.name) {
//     user = data;
//   }
// };

// const showUsersDetails = () => {
//   const displayUserInfo = document.getElementById("greetings");
//   const greetings = document.createElement("div");

//   if (user.name) {
//     // В БУДУЩЕМ НАДО БЫ СДЕЛАТЬ ДЛЯ ЭТОГО ВСЕГО ФУНКЦИЮ, А НЕ ДУБЛИРОВАТЬ КОД
//     // ПОРАБОТАТЬ С НАЗВАНИЯМИ ПЕРЕМЕННЫХ. НАПРИМЕР, SIGN OUT ОТНОСИТСЯ К ACCOUNTSETTINGS. НЕПОРЯДОК
//     greetings.innerHTML = `Hi, ${user.name}`;
//     displayUserInfo.appendChild(greetings);

//     const accountSettings = document.createElement("div");
//     accountSettings.innerHTML =
//       '<a href="/account-settings"> account settings</a> <div><a href="/signout"> sign out</a></div>';
//     displayUserInfo.appendChild(accountSettings);

//     if (user.admin) {
//       const adminPanel = document.createElement("div");
//       adminPanel.innerHTML = '<a href="/admin"> go to admin panel</a>';
//       displayUserInfo.appendChild(adminPanel);
//     }
//   } else {
//     greetings.innerHTML = `
//             <div><a href="/signin"> sign in</a></div>
//             <div><a href="/signup"> sign up</a></div>
//             `;
//     displayUserInfo.appendChild(greetings);
//   }
// };

// Display Articles

let articles = [];
const displayArticlesHere = document.getElementById("articles-on-main");

const getArticles = async () => {
  const response = await fetch("/api/getArticles");
  const data = await response.json();
  articles = data;
  return data;
};

const makeStringShorter = (str, num) => {
  if (str.length <= num) {
    return str;
  } else {
    return str.slice(0, num) + "...";
  }
};
// Каким-то образом создалась статья без параметра body. Это привело к ошибкам. Надо предусмотреть такой сценарий и ловить ошибки.

const sortArticles = () => {
  articles.forEach((article) => {
    const articleTitle = document.createElement("h2");
    const articleBody = document.createElement("div");

    articleTitle.innerHTML = `<a href="/articles/${article.id}">${article.title}</a>`;
    articleBody.innerHTML = makeStringShorter(article.body, 500);

    const displayedArticle = document.createElement("div");
    displayedArticle.className = `article-${articles.indexOf(article) + 1}`;
    displayArticlesHere.appendChild(displayedArticle);

    displayedArticle.appendChild(articleTitle);
    displayedArticle.appendChild(articleBody);
  });
};

getArticles().then(sortArticles);

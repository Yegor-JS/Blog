module.exports = (user, { content }) => {
  let username;
  if (user) {
    username = user.name;
  } 

  let userNav;
  if (!user) {
    userNav = `Hi, visitor! <a href="/signin">Sign in</a> or <a href="/signup">Sign up</a>`;
  } else if 
    (!user.admin) {
      userNav = `Hi, <a href="/account-settings">${username}!</a> <a href="/signout">(Sign out)</a>`
    } else {
      userNav = `Hi, <a href="/account-settings">${username}!</a> You're an <a href="/admin">admin</a>. <a href="/signout">(Sign out)</a>`
    }

  return `
      <!DOCTYPE html>
        <html lang="en">
        <head>
        ${userNav}
        </head>
  
        <body>
            ${content}
        </body>
      </html>
    `;
};

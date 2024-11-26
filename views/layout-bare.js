module.exports = ({ content }) => {
  return `
      <!DOCTYPE html>
        <html lang="en">
        <head>
        Hey, visitor!
        </head>
  
        <body>
          <div class="container">
            ${content}
          </div>
        </body>
      </html>
    `;
};

module.exports = (article) => {
  const getComments = () => {
    const comments = article.comments;
    const displayCommentsHere = document.createElement("div");

    comments.forEach((comment) => {
      const commentBody = document.createElement("div");
      commentBody.innerHTML = comment.commentBody;
      commentBody.className = `comment-${comments.indexOf(comment) + 1}`;
      displayCommentsHere.appendChild(commentBody);
    });

    return displayCommentsHere;
  };

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
    </head>
    <body>
    <div>
    ${article.title}
    </div>
    <div>
    ${article.body}
    </div>
    <div>
Comments (${"NUMBER OF COMMENTS, ADD VARIABLE LATER"}):
</div>
${getComments()}
<br><br>
<form method="POST">
<label for="body">Leave a comment:</label>
<textarea id="bodyInput" style="height:400px;width:600px;font-size:14pt;"
    placeholder="An interesting and respectful comment" name="body"></textarea><br><br>
<button>Post</button>
</form>

    </body>
    </html>
    `;
};

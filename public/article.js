module.exports = ({ article, user }) => {
  const commentsList = Object.keys(article.comments);
  const howManyComments = commentsList.length;
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
Comments (${howManyComments}):
</div>

<br><br>
<form method="POST">
<label for="body">Leave a comment:</label>
<textarea id="bodyInput" style="height:400px;width:600px;font-size:14pt;"
    placeholder="An interesting and respectful comment" name="comment"></textarea><br><br>
<button>Post</button>
</form>
<script src="http://127.0.0.1:3000/displayComments.js"></script>
<script>
    const htmlElementWithComments = getComments(${JSON.stringify(
      article
    )}, ${JSON.stringify(user)})
    document.body.appendChild(htmlElementWithComments)
</script>
    </body>
    </html>
    `;
};

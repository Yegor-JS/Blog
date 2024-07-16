function getComments(article) {
  const comments = Object.values(article.comments || {});
  const displayCommentsHere = document.createElement("div");

  comments.forEach((comment) => {
    const commentBody = document.createElement("div");
    commentBody.innerHTML = comment.commentBody;
    commentBody.className = `comment-${comments.indexOf(comment) + 1}`;
    displayCommentsHere.appendChild(commentBody);
  });

  return displayCommentsHere;
}
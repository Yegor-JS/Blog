function getComments(article) {
  const comments = Object.values(article.comments || {});
  console.log(comments);
  const displayCommentsHere = document.createElement("div");

  comments.forEach((comment) => {
    //Deal with date
    const commentDate = document.createElement("div");
    const date = new Date(comment.commentDate)
    const formattedDate = date.toLocaleString(navigator.language, {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit"
    });
    commentDate.innerHTML = formattedDate;
    displayCommentsHere.appendChild(commentDate);

    //Deal with comment body
    const commentBody = document.createElement("div");
    commentBody.innerHTML = comment.commentBody;
    commentBody.className = `comment-${comments.indexOf(comment) + 1}`;
    displayCommentsHere.appendChild(commentBody);
  });

  return displayCommentsHere;
}

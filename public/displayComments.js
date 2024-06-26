function getComments(article) {
  const comments = Object.values(article.comments || {});
  const displayCommentsHere = document.createElement("div");

  comments.forEach((comment) => {
    // Deal with date
    const commentDate = document.createElement("div");
    const date = new Date(comment.commentDate);
    const formattedDate = date.toLocaleString(navigator.language, {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
    commentDate.innerHTML = formattedDate;
    displayCommentsHere.appendChild(commentDate);

    // Deal with rating

    const currentUrl = window.location.href;
    const rating = document.createElement("div");
    const commentId = comment.commentId;
    rating.innerHTML = `
    <form method="POST" action="${currentUrl}/comments/${commentId}/upvote">
                  <button >+</button>
                </form>
    <form method="POST" action="${currentUrl}/comments/${commentId}/downvote">
                  <button >-</button>
                </form>
                `;
    displayCommentsHere.appendChild(rating);

    // Deal with comment body
    const commentBody = document.createElement("div");
    commentBody.innerHTML = comment.commentBody;
    commentBody.className = `comment-${comments.indexOf(comment) + 1}`;
    displayCommentsHere.appendChild(commentBody);
  });

  return displayCommentsHere;
}

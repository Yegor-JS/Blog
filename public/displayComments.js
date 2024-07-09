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
    const commentRating = comment.commentRating;
    const howManyUpvotes = commentRating.upvotes.length;
    const howManyDownvotes = commentRating.downvotes.length;
    rating.innerHTML = `
    <form method="POST" action="${currentUrl}/comments/${commentId}/vote?rating=upvotes">
                  <button class = "voting" id = "${commentId}">+</button>
                </form>
                <div id = upvotes-count-${commentId} >${howManyUpvotes}</div>
    <form method="POST" action="${currentUrl}/comments/${commentId}/vote?rating=downvotes">
                  <button class = "voting" id = "${commentId}" >-</button>
                </form>
                <div id = downvotes-count-${commentId} >${howManyDownvotes}</div>
                `;
    displayCommentsHere.appendChild(rating);

    // Deal with comment body
    const commentBody = document.createElement("div");
    commentBody.innerHTML = comment.commentBody;
    commentBody.className = `comment-${comments.indexOf(comment) + 1}`;
    displayCommentsHere.appendChild(commentBody);
  });

  ///
  const voting = displayCommentsHere.getElementsByClassName("voting");
  // console.log(voting)
  for (let element of voting) {
    element.addEventListener("click", async () => {
      const response = await fetch(
        `/api/get-comment-rating/${element.id}/${article.id}`
      );
      const data = await response.json();

      const upvotesCount = document.getElementById(
        `upvotes-count-${element.id}`
      );
      upvotesCount.innerHTML = data.upvotes.length;

      const downvotesCount = document.getElementById(
        `downvotes-count-${element.id}`
      );
      downvotesCount.innerHTML = data.downvotes.length;
    });
  }
  // ///

  return displayCommentsHere;
}

function getComments(article) {
  const comments = Object.values(article.comments || {});
  const displayCommentsHere = document.createElement("div");
  const currentUrl = window.location.href;

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
    const rating = document.createElement("div");

    const commentId = comment.commentId;
    const commentRating = comment.commentRating;
    const howManyUpvotes = commentRating.upvotes.length;
    const howManyDownvotes = commentRating.downvotes.length;
    rating.innerHTML = `
    <form method="POST">
                  <button class = "upvotes" id = "${commentId}">+</button>
                </form>
                <div id = upvotes-count-${commentId}>${howManyUpvotes}</div>
    <form method="POST">
                  <button class = "downvotes" id = "${commentId}">-</button>
                </form>
                <div id = downvotes-count-${commentId}>${howManyDownvotes}</div>
                `;
    displayCommentsHere.appendChild(rating);

    // Deal with comment body
    const commentBody = document.createElement("div");
    commentBody.innerHTML = comment.commentBody;
    commentBody.className = `comment-${comments.indexOf(comment) + 1}`;
    displayCommentsHere.appendChild(commentBody);
  });

  // Make it change dynamically
  const voting = displayCommentsHere.querySelectorAll(".upvotes, .downvotes");
  for (let element of voting) {
    const commentId = element.id;
    element.addEventListener("click", async (event) => {
      event.preventDefault();
      const response = await fetch(
        `${currentUrl}/comments/${commentId}/vote?rating=${element.className}`
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

  return displayCommentsHere;
}
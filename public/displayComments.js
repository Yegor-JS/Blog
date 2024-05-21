function getComments(article) {
  console.log('hi')
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

const currentUrl = window.location.href;

function getComments(article, user) {
  const comments = Object.values(article.comments || {});
  const displayCommentsHere = document.createElement("div");

  const signinToast = new Toastify({
    text: "Only logged-in users can vote. Please, sign in",
    gravity: "bottom",
    position: "center",
    destination: "/signin",
    style: {
      background: "#e14d45",
    },
    duration: 3000,
  });

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

    let deleteCommentsForAdmin = "";
    if (
      user !== undefined &&
      user.hasOwnProperty("admin") &&
      user.admin == true
    ) {
      deleteCommentsForAdmin = `
    <form method="POST" action='/admin/articles/${article.id}/comments/${commentId}/delete'>
                  <button>delete</button>
                </form>
                `;
    }

    rating.innerHTML = `
    <form method="POST">
                  <button class = "upvotes" id = "${commentId}">+</button>
                </form>
                <div id = upvotes-count-${commentId}>${howManyUpvotes}</div>
    <form method="POST">
                  <button class = "downvotes" id = "${commentId}">-</button>
                </form>
                <div id = downvotes-count-${commentId}>${howManyDownvotes}</div>
                ${deleteCommentsForAdmin}
                `;
    displayCommentsHere.appendChild(rating);

    // Deal with comment body
    const commentBody = document.createElement("div");
    commentBody.innerHTML = comment.commentBody;
    commentBody.className = `comment-${comments.indexOf(comment) + 1}`;
    displayCommentsHere.appendChild(commentBody);
  });

  const voting = displayCommentsHere.querySelectorAll(".upvotes, .downvotes");
  for (let element of voting) {
    const commentId = element.id;
    element.addEventListener("click", async (event) => {
      event.preventDefault();
      const response = await fetch(
        `${currentUrl}/comments/${commentId}/vote?rating=${element.className}`
      );
      // Response should contain an error instead of a link. Fix later, since there are several instances that will get affected by the change
      if (response.url.includes("/signin")) {
        signinToast.showToast();
      } else {
        const data = await response.json();
        const upvotesCount = document.getElementById(
          `upvotes-count-${element.id}`
        );
        upvotesCount.innerHTML = data.upvotes.length;

        const downvotesCount = document.getElementById(
          `downvotes-count-${element.id}`
        );
        downvotesCount.innerHTML = data.downvotes.length;
      }
    });
  }

  return displayCommentsHere;
}

// Warning users about comments size
const commentInput = document.getElementById("bodyInput");

commentInput.addEventListener("keyup", () => {
  const charactersLimit = 2000;
  const characterCounter = charactersLimit - commentInput.value.length;
  const isPlural = characterCounter == 1 || characterCounter == -1 ? "" : "s";
  const stringWithCounter = document.getElementById("bodyInputLabel");
  stringWithCounter.innerHTML = `Leave a comment (${characterCounter} character${isPlural} left)`;
});

//Posting a comment

// Preparing toasts
function signInForCommentingToast() {
  const toast = new Toastify({
    text: "Only logged-in users can leave comments. Please, sign in",
    gravity: "bottom",
    position: "center",
    destination: "/signin",
    style: {
      background: "#e14d45",
    },
    duration: 3000,
  });
  return toast.showToast();
}

function commentTooShortToast() {
  const toast = new Toastify({
    text: "Your comment must contain at least some characters",
    gravity: "bottom",
    position: "center",
    style: {
      background: "#e17145",
    },
    duration: 5000,
  });
  return toast.showToast();
}

function commentTooLongToast() {
  const toast = new Toastify({
    text: "Your comment is too long. Please, keep it no longer than 2000 characters",
    gravity: "bottom",
    position: "center",
    style: {
      background: "#e17145",
    },
    duration: 5000,
  });
  return toast.showToast();
}

//Limiting comment size
const commentForm = document.getElementById("bodyInputForm");
commentForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const response = await fetch("/api/identifyUser");
  const data = await response.json();
  console.log(data)
//Мы узнаем, залонинен ли пользователь, через api. Это хорошо бы изменить и сделать это знание универсальным по всему паблику. Возможно, через лучшие шаблоны
  if (!data.name) {
    signInForCommentingToast();
  } else if (commentInput.value.length < 1) {
    commentTooShortToast();
  } else if (commentInput.value.length > 2000) {
    commentTooLongToast();
  } else {
    commentForm.submit();
  }
});

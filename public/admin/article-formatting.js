const input = document.getElementById("bodyInput");

// add Toaster to head
const head = document.getElementsByTagName("head")[0];
const link = document.createElement("link");
link.rel = "stylesheet";
link.type = "text/css";
link.href = "https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css";
head.appendChild(link);

// Preparing toasts
function problemToast(errMsg) {
  const toast = new Toastify({
    text: `${errMsg}`,
    gravity: "bottom",
    position: "center",
    style: {
      background: "#e14d45",
    },
    duration: 3000,
  });
  return toast.showToast();
}

const defineInputs = () => {
  return {
    selectionStart: input.selectionStart,
    selectionEnd: input.selectionEnd,
    inputValue: input.value,
  };
};

const insertIntoText = (insertThis) => {
  const { selectionStart, inputValue } = defineInputs();
  input.value =
    inputValue.slice(0, selectionStart) +
    insertThis +
    inputValue.slice(selectionStart);
  input.selectionStart = input.selectionEnd =
    selectionStart + insertThis.length;

  input.focus();
};

const tagSelectedText = (openingTag, closingTag) => {
  const { selectionStart, selectionEnd, inputValue } = defineInputs();
  input.value =
    inputValue.slice(0, selectionStart) +
    openingTag +
    inputValue.slice(selectionStart, selectionEnd) +
    closingTag +
    inputValue.slice(selectionEnd);
  input.selectionStart = input.selectionEnd = selectionEnd + openingTag.length;

  input.focus();
};

const makeList = (openingTag, closingTag) => {
  // these const values will be defined again. Not good
  const { selectionStart, selectionEnd, inputValue } = defineInputs();

  const isList = () => {
    const targetString = inputValue.slice(selectionStart, selectionEnd);
    return targetString.match(/<ul>|<\/ul>|<ol>|<\/ol>/);
  };
  if (isList()) {
    replaceTags(
      ["<p>", "</p>", "<ul>", "<ol>", "</ul>", "</ol>"],
      ["<li>", "</li>", openingTag, openingTag, closingTag, closingTag],
    );
  } else {
    input.value =
      inputValue.slice(0, selectionStart) +
      `${openingTag}\r\n` +
      inputValue.slice(selectionStart, selectionEnd) +
      `\r\n${closingTag}` +
      inputValue.slice(selectionEnd);

    input.selectionStart = selectionStart + openingTag.length;
    input.selectionEnd = selectionEnd + closingTag.length;

    replaceTags(["<p>", "</p>"], ["<li>", "</li>"]);
  }
};

const safetify = (threat) => {
  return threat.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

const replaceTags = (oldTags, newTags) => {
  const { selectionStart, selectionEnd, inputValue } = defineInputs();
  let targetString = inputValue.slice(selectionStart, selectionEnd);
  const arrayLength = oldTags.length;

  for (let i = 0; i < arrayLength; i++) {
    const oldTagsRegExp = new RegExp(safetify(oldTags[i]), "g");
    targetString = targetString.replace(oldTagsRegExp, safetify(newTags[i]));
  }

  input.value =
    inputValue.slice(0, selectionStart) +
    targetString +
    inputValue.slice(selectionEnd);

  input.selectionStart = input.selectionEnd =
    input.value.length - inputValue.slice(selectionEnd).length;

  input.focus();
};

input.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    insertIntoText("</p>\r\n<p>");
  }
});

// UPLOADING IMAGES


// NEW STUFF

const imageInput = document.getElementById("imageInput");

const postImage = () => {
  imageInput.click()
}

imageInput.addEventListener("change", async () => {
  console.log(imageInput)
const file = imageInput.files[0];
if (!file)
  return
})



//END OF NEW STUFF

const [uploadImageForm] = document.forms;
const form = new FormData(uploadImageForm);
if (form.get("image")) {
  // OLDER CODE

  // uploadImageForm.onsubmit = function (event) {
  //   event.preventDefault()

  //   if (form.get("image")) {
  //   fetch('/images/new', {
  //     method: 'POST',
  //     body: form
  //   }).then(response => response.text())
  //     .then((id) => { insertIntoText(`\r\n{'picture id' : ${id} }\r\n`)
  //     })
  // }
  // }

  uploadImageForm.onsubmit = async function (event) {
    event.preventDefault();
    try {
      const form = new FormData(uploadImageForm);
      if (form.get("image").size === 0) {
        throw new Error("Please select an image file");
      }
      const response = await fetch("/images/new", {
        method: "POST",
        body: form,
      });
      const text = await response.text();
      if (!response.ok) {
        // const { status, statusText } = response;
        throw new Error();
      }
      insertIntoText(`\r\n{picture id: ${text}}\r\n`);
    } catch (err) {
      throw new Error();
    }
  };
}

// Youtube videos ID retrieval and embedding
// Insert Youytube link or video ID

const getYouTubeVideoId = (str) => {
  const YoutubeIdRegExp = new RegExp("^[A-Za-z0-9_-]{11}$");

  // Already an ID

  if (YoutubeIdRegExp.test(str)) {
    return str;
  }

  // Searching for the ID in the URL

  let url;

  try {
    url = new URL(str);
  } catch {
    problemToast("Can't recognise this link or ID");
    return;
  }

  // youtube.com/watch?v=id
  const v = url.searchParams.get("v");
  if (YoutubeIdRegExp.test(v)) {
    return v;
  }

  // everything else

  const id = url.pathname
    .split("/")
    .filter((element) => element.match(YoutubeIdRegExp))[0];
  if (id) {
    return id;
  } else {
    problemToast("Can't recognise this link");
    return;
  }
};

const embedYoutubeVideo = (linkOrID) => {
  const { selectionStart, inputValue } = defineInputs();
  let videoId = getYouTubeVideoId(linkOrID);
  if (!videoId) return;
  const youtubeVideoTag = `<iframe src=https://www.youtube.com/embed/${videoId}></iframe>`;
  input.value =
    inputValue.slice(0, selectionStart) +
    youtubeVideoTag +
    inputValue.slice(selectionStart);
  input.selectionStart = input.selectionEnd =
    input.selectionStart + youtubeVideoTag.length;

  input.focus();
};

const requestYoutubeInfo = (str) => {
  const userInput = prompt(str);

  if (userInput === null || userInput.trim() === "") {
    return;
  }
  embedYoutubeVideo(userInput);
};

const requestHyperlink = (str) => {
  const userInput = prompt(str);

  if (userInput === null || userInput.trim() === "") {
    return;
  }

  try {
    let url;
    url = new URL(userInput);
  } catch {
    problemToast("There is a problem with this URL");
    return;
  }

  tagSelectedText(`<a href="${userInput}">`, "</a>");
};

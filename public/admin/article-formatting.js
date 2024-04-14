const input = document.getElementById("bodyInput");

function defineInputs() {
  return {
    selectionStart: input.selectionStart,
    selectionEnd: input.selectionEnd,
    inputValue: input.value,
  };
}

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
      ["<li>", "</li>", openingTag, openingTag, closingTag, closingTag]
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

function safetify(threat) {
  return threat.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

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

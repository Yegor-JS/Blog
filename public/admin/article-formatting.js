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

  const isAlreadyList = () => {
    const targetString = inputValue.slice(selectionStart, selectionEnd);
    return targetString.match(/<ul>|<\/ul>|<ol>|<\/ol>/);
  };
  if (isAlreadyList()) {
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

const replaceTags = (oldTags, newTags) => {
  const { selectionStart, selectionEnd, inputValue } = defineInputs();
  let targetString = inputValue.slice(selectionStart, selectionEnd);
  const arrayLength = oldTags.length;
  const escapeRegExp = (str) => {
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  };

  for (let i = 0; i < arrayLength; i++) {
    const escapeRegExp = new RegExp(oldTags[i], "g");
    targetString = targetString.replace(escapeRegExp, newTags[i]);
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

const  getPicture = async () => {
    const response = await fetch("/images/new");
    const data = await response.json();
    console.log('data');
    return data;

};

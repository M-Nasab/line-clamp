const ELLIPSIS = '\u2026';
const WHITESPACE_REGEX = /(?=\s)/;
const TRAILING_WHITESPACE_REGEX = /\s+$/;

// Truncate the text of `element` such that it does not exceed the
// `maximumHeight`. Return `true` if we need to truncate by character, else
// return `false`.
function truncateByWord(element, maximumHeight) {
  const innerHTML = element.innerHTML;

  // Split the text of `element` by whitespace.
  let chunks = innerHTML.split(WHITESPACE_REGEX);

  // The text does not contain whitespace; we need to attempt to truncate
  // by character.
  if (chunks.length === 1) {
    return true;
  }

  // Loop over the chunks, and try to fit more chunks into the `element`.
  let i = -1;
  const length = chunks.length;
  let newInnerHTML = '';
  while (++i < length) {
    newInnerHTML += chunks[i];
    element.innerHTML = newInnerHTML;
    let elementHeight = parseInt(window.getComputedStyle(element).height, 10);

    // If the new height now exceeds the `maximumHeight` (where it did not
    // in the previous iteration), we know that we are at most one line
    // over the optimal text length.
    if (elementHeight > maximumHeight) {
      return true;
    }
  }

  return false;
}

// Append `ellipsisCharacter` to `element`, trimming off trailing characters
// in `element` such that `element` will not exceed the `maximumHeight`.
function truncateByCharacter(element, maximumHeight, ellipsisCharacter) {
  const innerHTML = element.innerHTML;
  let length = innerHTML.length;

  // In each iteration, we trim off one trailing character . Also trim
  // off any trailing punctuation before appending the `ellipsisCharacter`.
  while (length > 0) {
    element.innerHTML = innerHTML.substring(0, length).replace(TRAILING_WHITESPACE_REGEX, '') + ellipsisCharacter;
    let elementHeight = parseInt(window.getComputedStyle(element).height, 10);
    if (elementHeight <= maximumHeight) {
      return;
    }
    length--;
  }
}

export default function(element, { lineCount, ellipsisCharacter } = {}) {

  // Read the `line-height` of `element`, and use it to compute the height of
  // `element` required to fit the given `lineCount`.
  const lineHeight = parseInt(window.getComputedStyle(element).lineHeight, 10);
  const maximumHeight = lineCount * lineHeight;
  const elementHeight = parseInt(window.getComputedStyle(element).height, 10);

  // Exit if text does not overflow the `element`.
  if (elementHeight <= maximumHeight) {
    return;
  }

  truncateByWord(element, maximumHeight);
  truncateByCharacter(element, maximumHeight, ellipsisCharacter || ELLIPSIS);
}

//Ezgigi
function animateTitle(text) {
  let textToAnimate = text;
  let currentPosition = 0;
  let directionForward = true;

  function updateTitle() {
    if (currentPosition === textToAnimate.length) {
      directionForward = false;
    } else if (currentPosition === 0) {
      directionForward = true;
    }

    let displayedText = directionForward
      ? textToAnimate.slice(0, currentPosition + 1)
      : textToAnimate.slice(0, currentPosition - 1);

    document.title = displayedText;

    currentPosition = directionForward
      ? currentPosition + 1
      : currentPosition - 1;

    setTimeout(updateTitle, 222);
  }

  updateTitle();
}

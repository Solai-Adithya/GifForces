chrome.runtime.onMessage.addListener(removeGIFs);
function removeGIFs(message, sender, sendResponse) {
  if (message.remove) {
    elements = document.getElementsByClassName("resultgif");
    while (elements.length > 0) elements[0].remove();
  }
}

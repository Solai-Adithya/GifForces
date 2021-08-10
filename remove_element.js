chrome.runtime.onMessage.addListener(gotMessage);
function gotMessage(message, sender, sendResponse) {
  if (message.remove) {
    elements = document.getElementsByClassName("resultgif");
    while (elements.length > 0) elements[0].remove();
  }
}

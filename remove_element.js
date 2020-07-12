chrome.runtime.onMessage.addListener(gotMessage);
function gotMessage(message,sender,sendResponse) {
    if (message.txt === "remove") {
        console.log("content script received a message to remove the gif notification");
        elements = document.getElementsByClassName("resultgif");
        while (elements.length > 0) elements[0].remove();
    }
}

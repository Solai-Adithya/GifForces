console.log("remove element (content script) started running")

chrome.runtime.onMessage.addListener(gotMessage);
function gotMessage(message,sender,sendResponse) {
    if (message.txt === "remove") {
        console.log("received a message to remove the gif");
        elements = document.getElementsByClassName("resultgif");
        while (elements.length > 0) elements[0].remove();
    }
}

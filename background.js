console.log("background script started")

browser.browserAction.setIcon({ path: 'ui/enabled.png', });     
browser.browserAction.setPopup({ popup: 'ui/popup.html', });

// This piece of code is to receive message when gif on one tab is closed , then goes on to send messages to all tabs asking them to remove this gif
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    console.log("background.js just received a message from content script "+request);
    if (request.txt === "close" ) {
        console.log("message received to close all gifs on all tabs , sending message to all tabs")
        chrome.tabs.query({}, function (tabs) {
            for (let i = 0; i < tabs.length; i++) {
                if (/codeforces.com/.test(tabs[i].url) ) {
                    console.log("close message sent to tab "+tabs[i].id);
                    chrome.tabs.sendMessage(tabs[i].id,{txt : "remove"});
                }
            }
        });
    }
    sendResponse({msg:"background.js received a message from you to close all gifs" });
});

console.log("background script finished")

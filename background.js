console.log("background script started")

browser.browserAction.setIcon({ path: 'ui/enabled.png', });     
browser.browserAction.setPopup({ popup: 'ui/popup.html', });

console.log("background script finished")

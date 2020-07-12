console.log("popup.js running")
var handle;

document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("submit").addEventListener("click", setup);
    document.getElementById("deactivate").addEventListener("click",function() { set_active(false) });
    document.getElementById("activate").addEventListener("click",function() { set_active(true) });
});

function setup(event) {
    handle = document.getElementById("userinput").value;
    let message = { txt : true } //Activation Message
    console.log(" handle is "+ handle )
    window.localStorage.setItem('handle',handle);
    chrome.storage.local.set({'handle':handle},function () {
        console.log("handle sent")
    })
    chrome.tabs.query({}, function (tabs) {
        for (let i = 0; i < tabs.length; i++) {
            if (/codeforces.com/.test(tabs[i].url) ) {
                console.log("sending message to tab "+tabs[i].id)
                chrome.tabs.sendMessage(tabs[i].id,message);
            }
        }
    });
    setTimeout(window.close(),200);
}

function set_active(active)
{
    console.log("function set_active running and value of active is "+active)
    chrome.tabs.query({}, function (tabs) {
        for (let i = 0; i < tabs.length; i++) {
            if (/codeforces.com/.test(tabs[i].url) ) {
                console.log("sending message to tab "+tabs[i].id)
                chrome.tabs.sendMessage(tabs[i].id,{ active:active });
            }
        }
    });
    if (active) {
        chrome.browserAction.setIcon({ path: 'enabled.png' });
        document.getElementById("activate").style.display = "none";
        document.getElementById("deactivate").style.display = "block";
    }
    else {
        chrome.browserAction.setIcon({ path: 'disabled.png' });
        document.getElementById("deactivate").style.display = "none";
        document.getElementById("activate").style.display = "block";
    }
}

console.log("popup.js finished")
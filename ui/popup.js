function disable() {
    chrome.tabs.query({currentWindow: true}, function (tabs) {
        browser.browserAction.setIcon({ path: 'disabled.png', });
        let msgturnoff = {
            txt:"turn-off"
        }
        for (let i = 0; i < tabs.length; i++) {
            if (/codeforces.com/.test(tabs[i].url) ) {
                chrome.tabs.sendMessage(tabs[i].id,msgturnoff);
            }
        }
    });
    
}
// var activetab = tabs[0];
var output;
function enable() 
{
    
    browser.browserAction.setIcon({ path: 'enabled.png', });

    var handle = document.getElementById("handle").value;
    var URL = `https://codeforces.com/api/user.status?handle=${handle}&from=1&count=5`
    
    fetch(URL, {method: "GET"})
    .then(function(json) {
        console.log("json function follows")    
        console.log(jsondata) 
        jsondata = JSON.stringify(json)
        window.output = jsondata 
        console.log(window.output)
    }) 
    chrome.tabs.query({currentWindow: true}, function(tabs) 
    {
        for (let i = 0; i < tabs.length; i++) {
            if (/codeforces.com/.test(tabs[i].url) ) {
                console.log("outer function follows")
                setTimeout(function(){console.log(window.output);},1000);
                chrome.tabs.sendMessage(tabs[i].id,{ op:window.output , txt:"turn-on" });
            }
        }
    });
}
document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("disable").addEventListener("click", disable);
});

document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("enable").addEventListener("click", enable);
});

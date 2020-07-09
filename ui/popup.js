console.log("popup.js running")

function setup(event) {
    let userinput = document.getElementById("userinput").value;

    //Value got from input field in popup
    let message = { txt :true }
    console.log(" handle is "+ userinput )
    localStorage.setItem('handle',userinput);
    chrome.tabs.query({currentWindow: true}, function (tabs) {
        for (let i = 0; i < tabs.length; i++) {
            if (/codeforces.com/.test(tabs[i].url) ) {
                console.log("sending message to a tab")
                console.log(tabs[i].id)
                chrome.tabs.sendMessage(tabs[i].id,message);
            }
        }
    });
}

document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("submit").addEventListener("click", setup);
});


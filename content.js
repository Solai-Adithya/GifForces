console.log("success");

//document.getElementById("sidebar").style.display = "none" ;

// chrome.storage.local.get('handle', function (items) {
//     assignTextToTextareas(items.handle);
//     chrome.storage.local.remove('handle');
// });

chrome.runtime.onMessage.addListener(gotMessage);

function gotMessage(message,sender,sendResponse) {

    var handle = message.handle ;
    console.log("handle received : "+ handle)
    var URL = `https://codeforces.com/api/user.status?handle=${handle}&from=1&count=5`;
    var jsondata;
    fetch(URL, {method: "GET"})
        .then(function(json) {
            console.log("json function follows")
            jsondata = json
            console.log(jsondata)
        })

    const div = document.createElement('div')
    div.className = "resultgif"
    div.insertAdjacentHTML("afterbegin",`
        <style>
        .resultgif {
            position:fixed;
            bottom:2px ;
            width:279px;
            align-items:center;
        }
        .resultgif .sidebox {
            margin-bottom:12px;
        }
        .resultgif #CenterThis {
            display: block;
            margin-left: auto;
            margin-right: auto;
            width:75%;
        }
        .resultgif #close:hover {
            font-size:1.1em;
        }
        .resultgif #close {
            color:red;
            margin:2px;
            padding: 0 5px 0 5px;
            border: black 1px solid;
        }
        </style>
        <div class="roundbox sidebox" style="">
            <div class="roundbox-lt">&nbsp;</div>
            <div class="roundbox-rt">&nbsp;</div>
            <div class="caption titled">
                → Result of your last submission <span id='close' onclick='this.parentNode.parentNode.parentNode.removeChild(this.parentNode.parentNode); return false;'>x</span>
            </div>
            <img id="CenterThis" src="https://media.giphy.com/media/ddHhhUBn25cuQ/giphy.gif" alt="some gif has gotta come here" height=150>
            <p id="CenterThis">Result: Accepted</p>
            <p id="CenterThis">Problem: Whatever </p>
        </div>
        `);
    document.getElementById('sidebar').appendChild(div);
}

console.log("final success");


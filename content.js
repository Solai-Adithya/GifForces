console.log("success");

//document.getElementById("sidebar").style.display = "none" ;

chrome.runtime.onMessage.addListener(gotMessage);

function gotMessage(message,sender,sendResponse) {
    console.log(message)
    console.log("in content script , json follows")
    setTimeout(function(){console.log(message);},3000);

    if(message.txt === "turn-on") {
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
            padding: 0px 5px 0px 5px;
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
        // chrome.extension.getURL("images/myimage.png");
        document.getElementById('sidebar').appendChild(div); 
    }
    else if (message.txt === "turn-off") {
        const elements = document.getElementsByClassName("resultgif");
        while (elements.length > 0) elements[0].remove();
    }
}
console.log("final success");


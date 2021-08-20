function displayGIF(problem_verdict, problem_index) {
  if (problem_verdict === "OK") {
    if (problem_index.includes('A')) { document.getElementById("gif").src = chrome.extension.getURL("icons/A.gif"); }
    else if (problem_index.includes('B') ) { document.getElementById("gif").src = chrome.extension.getURL("icons/B.gif"); }
    else if (problem_index.includes('C' )) { document.getElementById("gif").src = chrome.extension.getURL("icons/C.gif"); }
    else if (problem_index.includes('D' ))  { document.getElementById("gif").src = chrome.extension.getURL("icons/D.gif"); }
    else if (problem_index.includes('E' )) { document.getElementById("gif").src = chrome.extension.getURL("icons/E.gif"); }
    else { document.getElementById("gif").src = chrome.extension.getURL("icons/god.gif") } // Intended for F and above problems
    document.getElementById("result").style.color = "green";
  } else {
    document.getElementById("gif").src = chrome.extension.getURL("icons/WA.gif");
    document.getElementById("result").style.color = "red";
  }
}

function publish(verdict, problem_name, problem_index) {
  if (document.getElementsByClassName("resultgif").length != 0) {
    document.getElementById("result").innerHTML = "Verdict : " + verdict;
    document.getElementById("problem_name").innerHTML =
      "Problem : " + problem_name;
  } else {
    const div = document.createElement("div");
    div.className = "resultgif";
    div.insertAdjacentHTML(
      "afterbegin",
      `
      <style>
      .resultgif {
          position:fixed;
          bottom:0px ;
          width:279px;
          align-items:center;
      }
      .resultgif .sidebox {
          margin-bottom:0px;
      }
      .resultgif .CenterThis {
          display: block;
          margin-left: auto;
          margin-right: auto;
          width:75%;
      }
      .resultgif #close {
          color:red;
          float: right;
          cursor: pointer;
          font-size: 1.25em;
          vertical-align: middle;
          margin-right: 10px;
      }
      </style>
      <div class="roundbox sidebox" style="">
          <div class="roundbox-lt">&nbsp;</div>
          <div class="roundbox-rt">&nbsp;</div>
          <div class="caption titled">
              → Result of your last submission <span id='close' class='infobar-close' onclick='this.parentNode.parentNode.parentNode.removeChild(this.parentNode.parentNode); return false;'>×</span>
          </div>
          <img class="CenterThis" id="gif"  alt="GIF" height=150>
          <strong><p id= "result" style="padding: 10px 0 2px 10px" >Verdict: </p></strong>
          <p id="problem_name" style="padding:3px 0 10px 10px ">Problem: </p>
      </div>
      `
    );
    document.getElementById("sidebar").appendChild(div);
    document.getElementById("result").innerHTML += verdict;
    document.getElementById("problem_name").innerHTML += problem_name;
  }

  displayGIF(verdict, problem_index);

  document.getElementById("close").addEventListener("click", function () {
    chrome.runtime.sendMessage({ close: true }); //Sending message to popup.js to close all gifs
  });
}

chrome.runtime.onMessage.addListener(publishGIF)
function publishGIF(message, sender, sendResponse) {
  if (message.publish) {
    publish(message.verdict, message.problem_name, message.problem_index);
  }
}

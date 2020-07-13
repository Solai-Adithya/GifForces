var t1;

function fetchapi() {
  chrome.storage.local.get(['handle'], function (items) {
    console.log("handle as received in content script is " + items.handle);
    handle = items.handle;
    console.log("handle received : " + handle)
    var URL = `https://codeforces.com/api/user.status?handle=${handle}&from=1&count=1`;
    var last_submission;

    // The following's purpose is to have an initial log of last_submission to help with comparison
    fetch(URL, {method: "GET"})
      .then(res => res.json())
      .then(function (data) {
        last_submission = data['result'][0]['id'];
        t1=setInterval(geturl,1000);
      })

    // The following keeps calling the API to receive the last submission's details
    function geturl() {
      fetch(URL, {method: "GET"})
        .then(res => res.json())
        .then(function (data) {
          if (data['result'][0]['id'] !== last_submission && data['result'][0]['verdict'] !== "TESTING" && data['result'][0]['verdict'] !== undefined)
          {
            verdict = data['result'][0]['verdict']
            problem_name = data['result'][0]['problem']['name']
            if(document.getElementsByClassName('resultgif').length != 0) //If the class resultgif already exists , we just change the gif,verdict and problem name.
            {
              document.getElementById('result').innerHTML = "Verdict : "+verdict;
              document.getElementById('problem_name').innerHTML = "Problem : "+problem_name;
              if (verdict === "OK") {
                document.getElementById("gif").src = "https://media.giphy.com/media/87NS05bya11mg/giphy.gif";
                document.getElementById("result").style.color = "green";
              }
              else {
                document.getElementById("gif").src = "https://media.giphy.com/media/3ohs81rDuEz9ioJzAA/giphy.gif";
                document.getElementById("result").style.color = "red";
              }
            }
            else
            {
              console.log("We have got a new submission , verdict is " + verdict + " for problem " + problem_name);
              publish(verdict, problem_name)
              function publish(P_verdict, P_name) {
                const div = document.createElement('div')  //contains css and html code to inject into target page
                div.className = "resultgif";
                div.insertAdjacentHTML("afterbegin", `
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
                      <strong><p id= "result" style="padding: 10px 0 2px 10px" >Verdict : </p></strong>
                      <p id="problem_name" style="padding:3px 0 10px 10px ">Problem : </p>
                  </div>
                  `);
                document.getElementById('sidebar').appendChild(div)
                document.getElementById('result').innerHTML += P_verdict;
                document.getElementById('problem_name').innerHTML += P_name;
                if (P_verdict === "OK") {
                  document.getElementById("gif").src = "https://media.giphy.com/media/87NS05bya11mg/giphy.gif";
                  document.getElementById("result").style.color = "green"
                }
                else {
                  document.getElementById("gif").src = "https://media.giphy.com/media/3ohs81rDuEz9ioJzAA/giphy.gif";
                  document.getElementById("result").style.color = "red";
                }
                document.getElementById("close").addEventListener("click", function () {
                  chrome.runtime.sendMessage({txt: "close"}, function (response) {
                    console.log(response)
                  }) //Sending message to popup.js to close all gifs
                  console.log("Message sent to all tabs to close the gif ")
                })
              }
            }
            last_submission = data['result'][0]['id'];
          }
        })
    }
  })
}

// This piece of code is to reload the content script and get the handle when entered by user after the site was loaded
chrome.runtime.onMessage.addListener(gotMessage);
function gotMessage(message,sender,sendResponse) { //This message is expected when a new handle is entered
  if (message.txt === true) {
    fetchapi();
  }
  if(message.active === false) { //This message is expected when enable/disable button is pressed
    clearInterval(t1);
    chrome.runtime.sendMessage({txt: "close"}, function (response) {
      console.log("response from background was "+response)
    })
  }
  else if(message.active === true) {
    fetchapi();
  }
}

fetchapi();

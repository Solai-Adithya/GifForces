!!!!!!!!!!
 browser.browserAction.setIcon({ path: 'enabled.png', });
!!!!!!!!!!




  !!!!!!!!!!!
    function geturl() {
        fetch(URL, {method: "GET"})
          .then(res => res.json())
          .then(function (data)
          {
              i=0;
              while (i < data['result'].length)
              {
                  console.log(" last problem is "+data['result'][i]['problem']['name']+" and verdict is "+data['result'][i]['verdict']);
                  if (data['result'][i]['verdict'] === "TESTING" )
                  {
                      console.log("SUCCESS!!!")
                      pending.push(data['result'][i]['id']);
                      i++;
                      flag = 1;
                  }
                  else { break; }
              }
              if(flag === 1) {
                  console.log("array pending is " + pending)
                  check();
              }
              function check()
              {
                  if (pending.length > 0)
                  {
                      for (i = 0; i < pending.length; i++)
                      { for (j = 0; j < data['status'].length; j++)
                      { if (pending[i] === data['result'][j]['id'] && data['result'][j]['verdict'] != "TESTING")
                      {
                          verdict = data['result'][j]['verdict']
                          problem_name = data['result'][j]['problem']['name']
                          publish(verdict, problem_name);
                      }
                      }
                      }
                      pending = [];
                  }
              }
              function publish(P_verdict, P_name)
              {
                  console.log("Problem Name: " + P_name)
                  const div = document.createElement('div')  //contains css and html code to inject into target page
                  div.className = "resultgif";
                  div.insertAdjacentHTML("afterbegin", `
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
              .resultgif .CenterThis {
                  display: block;
                  margin-left: auto;
                  margin-right: auto;
                  width:75%;
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
                  <img class="CenterThis" id="gif"  alt="GIF" height=150>
                  <p id= "result"  >Verdict : </p>
                  <p id="problem_name" >Problem Name : </p>
              </div>
              `);
                  document.getElementById('sidebar').appendChild(div)
                  document.getElementById('result').innerHTML += P_verdict;
                  document.getElementById('problem_name').innerHTML += P_name;
                  if (P_verdict === "OK") {
                      document.getElementById("gif").src = "https://media.giphy.com/media/87NS05bya11mg/giphy.gif";
                  } else {
                      document.getElementById("gif").src = "https://media.giphy.com/media/3ohs81rDuEz9ioJzAA/giphy.gif";
                  }
              }
          })
    }
    !!!!!!!!!




!!! popup.js file
var handle = document.getElementById("my-form").elements[0].value();
console.log("handle obtained")
console.log(handle)
chrome.tabs.query({currentWindow: true}, function (tabs) {
    for (let i = 0; i < tabs.length; i++) {
        if (/codeforces.com/.test(tabs[i].url) ) {
            console.log("sending message to a tab")
            console.log(tabs[i].id)
            chrome.tabs.sendMessage(tabs[i].id,{handle : handle});
        }
    }
});
}
document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("SubmitButton").addEventListener("click", FormSubmitted);
});
!!!




!!!!!!!!!!
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
!!!!!!!



!!!!!!!
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
         // chrome.extension.getURL("images/myimage.png");
         document.getElementById('sidebar').appendChild(div);
     }
     else if (message.txt === "turn-off") {
         const elements = document.getElementsByClassName("resultgif");
         while (elements.length > 0) elements[0].remove();
     }
 }
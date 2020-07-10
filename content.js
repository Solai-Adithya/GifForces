console.log("success");

chrome.runtime.onMessage.addListener(gotMessage);

function gotMessage(message,sender,sendResponse) {
  if (message.txt === true) {

    chrome.storage.local.get(['handle'],function(items){
      handle = items.handle;
      console.log("handle received : " + handle)
      var URL = `https://codeforces.com/api/user.status?handle=${handle}&from=1&count=5`;
      var result;
      var t1=setInterval(testgeturl,500);
      var pending = [];
      var last_submission ;

      fetch(URL, {method: "GET"})
        .then(res => res.json())
        .then(function (data)
        {
          last_submission = data['result'][0]['id'];
        })

      function testgeturl() {
        fetch(URL, {method: "GET"})
          .then(res => res.json())
          .then(function (data)
          {
            if(data['result'][0]['id'] != last_submission)
            {
              verdict = data['result'][j]['verdict']
              problem_name = data['result'][j]['problem']['name']
              publish(verdict, problem_name)
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
            }
            last_submission = data['result'][0]['id'];
          })
      }
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
    })
  }

}

console.log("final success");


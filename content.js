console.log("success");

chrome.runtime.onMessage.addListener(gotMessage);

function gotMessage(message,sender,sendResponse) {
    var handle = message.handle ;
    console.log("handle received : "+ handle)
    var URL = `https://codeforces.com/api/user.status?handle=${handle}&from=1&count=5`;
    var result;
    var pending=[];
    fetch(URL, {method: "GET"})
        .then(res => res.json())
        .then(function(data) {
            console.log("json function follows")

            for(i=0;i<data['result'].length;i++)
            {
                verdict = data['result'][i]['verdict']
                problem_name = data['result'][i]['problem']['name']
                if (verdict == "TESTING") {
                    pending.push(data['result'][i]['id'])
                }
            }

            if(pending.length>0)
            {
                for(i=0;i<pending.length;i++)
                {
                    for(j=0;j<data['status'].length;j++)
                    {
                        if(pending[i] === data['result'][j]['id'] && data['result'][j]['verdict']!="TESTING") {
                            verdict = data['result'][j]['verdict']
                            problem_name = data['result'][j]['problem']['name']
                            publish(verdict,problem_name);
                        }
                    }
                }
            }

            function publish(P_verdict,P_name)
            {

            }

            if(data['status'] == "OK")
            {
                // for(i=0;i<data['result'].length;i++) {
                //     verdict = data['result'][0]['verdict']
                //     problem_name = data['result'][0]['problem']['name']
                // }
                console.log("Problem Name: " +  problem_name)

                const div = document.createElement('div')  //contains css and html code to inject into target page
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
                .resultgif .CenterThis {
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
                <script>
                
                </script>
                <div class="roundbox sidebox" style="">
                    <div class="roundbox-lt">&nbsp;</div>
                    <div class="roundbox-rt">&nbsp;</div>
                    <div class="caption titled">
                        → Result of your last submission <span id='close' onclick='this.parentNode.parentNode.parentNode.removeChild(this.parentNode.parentNode); return false;'>x</span>
                    </div>
                    <img class="CenterThis" src="https://media.giphy.com/media/ddHhhUBn25cuQ/giphy.gif" alt="GIF" height=150>
                    <p id= "result"  >Verdict : </p>
                    <p id="problem_name" >Problem Name : </p>
                </div>
                ` );
                document.getElementById('sidebar').appendChild(div)
                document.getElementById('result').innerHTML += verdict;
                document.getElementById('problem_name').innerHTML += problem_name;
            }
            // else if ()
        })
}

console.log("final success");


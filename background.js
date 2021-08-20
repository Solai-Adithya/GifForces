chrome.browserAction.setIcon({ path: "ui/enabled.png" });
chrome.browserAction.setPopup({ popup: "ui/popup.html" });

function notify(problem_name, verdict) {
  var messageText, iconURL;
  if (verdict === "OK") {
    verdict = "Accepted";
    iconURL = "icons/accepted.png";
  } else {
    iconURL = "icons/wrong-ans.png";
  }
  messageText = verdict + " - " + problem_name;
  browser.notifications.create(verdict, {
    type: "basic",
    iconUrl: browser.runtime.getURL(iconURL),
    title: "GifForces",
    message: messageText,
  });
}

function removeGifsOnAllTabs() {
  chrome.tabs.query({}, function (tabs) {
    for (let i = 0; i < tabs.length; i++) {
      if (/codeforces.com/.test(tabs[i].url)) {
        chrome.tabs.sendMessage(tabs[i].id, { remove: true });
      }
    }
  });
}

// when gif on one tab is closed, then send messages to all tabs asking them to remove the gif
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.close) {
    removeGifsOnAllTabs();
  }
});

function fetchAPI(handle) {
  let failureCount = 0, repeat, lastSubmissionTime=0;
  const timeout = 500, URL = `https://codeforces.com/api/user.status?handle=${handle}&from=1&count=1`;

  fetch(URL, { method: "GET" })
    .then((res) => res.json())
    .then(function (data) {
      lastSubmissionTime = data["result"][0]["creationTimeSeconds"];
      // If the last solution was submitted less than 20 seconds ago then fetch API repeatedly else quit.
      if (Math.floor(Date.now() / 1000) - lastSubmissionTime <= 20) {
        repeat = setInterval(geturl, timeout);
      } else {
        return;
      }
    });

  // keep calling the API to receive the last submission's details
  function geturl() {
    fetch(URL, { method: "GET" })
      .then((res) => res.json())
      .then(function (data) {
        if (!["TESTING", undefined].includes(data["result"][0]["verdict"])) {
          verdict = data["result"][0]["verdict"];
          problem_name = data["result"][0]["problem"]["name"];
          problem_index = data["result"][0]["problem"]["index"];

          chrome.tabs.query({}, function (tabs) {
            for (let i = 0; i < tabs.length; i++) {
              if (tabs[i].url.match(/codeforces.com/)) {
                chrome.tabs.sendMessage(
                  tabs[i].id,
                  {
                    publish: true,
                    verdict: verdict,
                    problem_name: problem_name,
                    problem_index: problem_index,
                  }
                );
              }
            }
          });
          notify(problem_name, verdict);
          clearInterval(repeat);
          return;
        } else if (data["result"][0]["verdict"] === undefined) {
          failureCount++;
          if (failureCount >= 2667) {
            // If the API calls return undefined for more than 10 minutes, then quit.
            clearInterval(repeat);
            return;
          }
        }
      });
  }
}

function triggerAPICall(request) {
  // Trigger the API call only when a submission request is made.
  // Observation: When a submission is made, a POST request is made with 'referrer' field that can be matched using regex and without an 'origin' field in the request header
  if (request.method == "POST") {
    const headers = request.requestHeaders;
    const referrerRegex = RegExp(/codeforces.com\/.*\/submit/);
    let submission = true;
    for (let i = 0; i < headers.length; i++) {
      if (headers[i].name == "Origin") {
        submission = false;
        break;
      }
    }
    if (submission) {
      for (let i = 0; i < headers.length; i++) {
        if (
          headers[i].name == "Referer" &&
          headers[i].value.match(referrerRegex)
        ) {
          chrome.storage.local.get(["handle"], function (items) {
            handle = items.handle;
            if (handle === undefined) {
              return;
            }
            fetchAPI(handle);
          });
          break;
        }
      }
    }
  }
}

const targetURLs = [
  "https://codeforces.com/*",
  "https://m1.codeforces.com/*",
  "https://m2.codeforces.com/*",
  "https://m3.codeforces.com/*",
];
browser.webRequest.onBeforeSendHeaders.addListener(
  triggerAPICall,
  { urls: targetURLs },
  ["requestHeaders"]
);

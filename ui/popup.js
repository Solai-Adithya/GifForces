document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("submit").addEventListener("click", function () {
    setup();
  });
});

function setup() {
  const handle = document.getElementById("userinput").value;
  if (handle!==undefined && handle!==null) {
    chrome.storage.local.set({ handle: handle }, function () {
      console.log("handle sent");
      setTimeout(window.close(), 200);
    });
  }
}

//This is used to autofill the last entered handle
chrome.storage.local.get(['handle'], function (items) {
    if(items.handle !== undefined) {
        document.getElementById('userinput').setAttribute('value', items.handle);
    }
    else {
        document.getElementById('userinput').setAttribute('placeholder', 'Your Codeforces handle');
    }
});
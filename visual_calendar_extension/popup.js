console.log('This is a popup!');


chrome.tabs.create({
    url: chrome.runtime.getURL("calendar.html")
});


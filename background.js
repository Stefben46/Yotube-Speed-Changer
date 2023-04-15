chrome.browserAction.onClicked.addListener(function(tab) {
    chrome.browserAction.setPopup({tabId: tab.id, popup: 'popup.html'});
  });

chrome.tabs.query({url: "*://www.youtube.com/*"}, function(tabs) {
  if (tabs.length) {
    chrome.tabs.executeScript(tabs[0].id, {file: "content.js"});
  }
});


chrome.runtime.onConnect.addListener(function(port) {
  if (port.name == "popup") {
    port.onMessage.addListener(function(request) {
      if (request.action == "getCurrentSpeed") {
        chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
          const activeTab = tabs[0];
          chrome.scripting.executeScript({target: {tabId: activeTab.id, allFrames: true}, function: () => {
            return document.querySelector("video").playbackRate;
          }}, function(result) {
            port.postMessage({speed: result && result[0]});
          });
        });
      }
    });
  }
});
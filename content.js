
function setVideoSpeed() {
  chrome.storage.local.get(['speed'], (result) => {
    const video = document.querySelector('video');
    if (video && 'playbackRate' in video) {
      const speed = result.speed || 1;
      video.playbackRate = speed;
      chrome.storage.local.set({ speed });
    }
  });
}




chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === 'callFunction' && request.functionName === 'setSpeed') {
    handleNavigationStart();
  }
});

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.action == "getPlaybackRate")
      sendResponse({farewell: document.getElementsByTagName("video")[0].playbackRate});
  });

  function buttonDoesNotExist() {
    const button = document.querySelector('#movie_player > div.ytp-chrome-bottom > div.ytp-chrome-controls > div.ytp-left-controls > div.ytp-time-display.notranslate.ytp-live > button'); // replace #specificButton with the CSS selector for the button you're checking for
    return !button;
  }

// Function to handle the 'yt-navigate-start' event, which is triggered every time a new video is opened
function handleNavigationStart() {
  if (buttonDoesNotExist()) { // only call setVideoSpeed() if the button isn't found
    setVideoSpeed();
  }
}

// Add an event listener to the 'yt-navigate-start' event
window.addEventListener('yt-navigate-start', handleNavigationStart);
window.addEventListener('popstate', handleNavigationStart);
window.addEventListener('timeupdate', handleNavigationStart);
window.addEventListener('yt-navigate-finish', handleNavigationStart);
// Call the functions once on page load
handleNavigationStart();

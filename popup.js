// Function to get the current video speed from the content script
function getCurrentSpeed() {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {action: "getPlaybackRate"}, function(response) {
      var result = response.farewell;
      var speedDisplay = document.getElementById('speed-display');
      if (result) {
        speedDisplay.textContent = `Current speed: ${result}x`;
      } else {
        speedDisplay.textContent = 'Cannot retrieve current speed';
      }
    });
  });
}

// Query for the active tab and add event listener to save button
chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
  const activeTab = tabs[0];
  
  // Check if the active tab's URL matches the desired pattern
  if (activeTab.url.startsWith("https://www.youtube.com/")) {
    const speedSelect = document.getElementById('speed-select');
    const saveButton = document.getElementById('save-button');

    // Save video speed when save button is clicked
    saveButton.addEventListener('click', function() {
      const selectedSpeed = speedSelect.value;
      chrome.storage.local.set({ speed: selectedSpeed });

      // Call setSpeed() function in the content script
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {action: 'callFunction', functionName: 'setSpeed'});
      });

      setTimeout(function () {
        getCurrentSpeed(); // Update the current speed display after setting the new speed
      }, 100);
    });
  
    getCurrentSpeed(); // Get the current video speed on page load
  } 
});



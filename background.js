chrome.action.onClicked.addListener((tab) => {
    // When the extension icon is clicked, inject the overlay script into the current tab
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['overlay.js']
    });
  });
  
window.addEventListener("message", function(event) {
    // Only accept messages from the same frame
    if (event.source !== window) return;
  
    if (event.data.type && event.data.type === "FROM_PAGE") {
      chrome.runtime.sendMessage(event.data.message, function(response) {
        window.postMessage({ type: "FROM_EXTENSION", message: response }, "*");
      });
    }
  }, false);
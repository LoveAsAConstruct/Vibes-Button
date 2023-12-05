console.log("content online");
window.addEventListener("message", function(event) {
    console.log("listener added")
    // Only accept messages from the same frame
    if (event.source !== window) return;
    
    if (event.data.type && event.data.type === "FROM_PAGE") {
        console.log("sending message");
      chrome.runtime.sendMessage(event.data.message, function(response) {
        window.postMessage({ type: "FROM_EXTENSION", message: response }, "*");
      });
    }
  }, false);
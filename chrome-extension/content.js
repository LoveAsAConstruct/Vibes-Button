console.log("content online");

window.addEventListener("message", function(event) {
    console.log("listener added");

    // Only accept messages from the same frame
    if (event.source !== window) return;

    if (event.data.type) {
        if (event.data.type === "FROM_PAGE") {
          if(event.data.action && event.data.action === "setUserId") {
            console.log("Content script: Setting userId in background script");
            chrome.runtime.sendMessage({ action: "setUserId", userId: event.data.userId });
          } else if (event.data.action && event.data.action === "getUserId") {
            console.log("sending query for userID")
            // Send message to background script to get user ID
            chrome.runtime.sendMessage({ action: "getUserId" }, function(response) {
              window.postMessage({ type: "USER_ID_RESPONSE", userId: response.userId }, "*");
            });
          } else {
            console.log("sending message to background script:", event.data.message);
            chrome.runtime.sendMessage(event.data.message, function(response) {
              window.postMessage({ type: "FROM_EXTENSION", message: response }, "*");
            });
          }
        }
    }
}, false);
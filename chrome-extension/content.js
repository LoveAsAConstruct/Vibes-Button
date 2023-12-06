console.log("content online");
window.contentScriptReady = true;
window.addEventListener("message", function(event) {
  console.log("message recieved");

  // Only accept messages from the same frame
  if (event.source !== window) return;
  
  if (event.data.type) {
    console.log("Received event data:", event.data);
    if (event.data.type === "SET_USER_ID") {
      console.log("setting userid");
      // Send message to background script to set user ID
      chrome.runtime.sendMessage({ action: "setUserId", userId: event.data.userId });
    } else if (event.data.type === "GET_USER_ID") {
      console.log("getting userid");
      // Send message to background script to get user ID
      chrome.runtime.sendMessage({ action: "getUserId" }, function(response) {
          window.postMessage({ type: "USER_ID_RESPONSE", userId: response.userId }, "*");
      });
    } else if (event.data.type === "FROM_PAGE") {
      console.log("sending message to background script:", event.data.message);
      chrome.runtime.sendMessage(event.data.message, function(response) {
        window.postMessage({ type: "FROM_EXTENSION", message: response }, "*");
      });
    }
  }
}, false);
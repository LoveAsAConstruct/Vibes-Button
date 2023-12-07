// Indicate that the content script is ready
console.log("content online");
window.contentScriptReady = true;

// Handle messages received from the page
window.addEventListener("message", function(event) {
  // Ignore messages not from the same frame
  if (event.source !== window) {
    return;
  }

  console.log("message received");

  // Process different types of messages
  switch (event.data.type) {
    case "SET_USER_ID":
      console.log("setting userid");
      // Send user ID to the background script
      chrome.runtime.sendMessage({ action: "setUserId", userId: event.data.userId });
      break;

    case "GET_USER_ID":
      console.log("getting userid");
      // Request user ID from the background script
      chrome.runtime.sendMessage({ action: "getUserId" }, function(response) {
        window.postMessage({ type: "USER_ID_RESPONSE", userId: response.userId }, "*");
      });
      break;

    case "FROM_PAGE":
      console.log("sending message to background script:", event.data.message);
      // Relay message to the background script and post the response
      chrome.runtime.sendMessage(event.data.message, function(response) {
        window.postMessage({ type: "FROM_EXTENSION", message: response }, "*");
      });
      break;
  }
}, false);

// Handle DOMContentLoaded event
document.addEventListener('DOMContentLoaded', function() {
  // Check if the current page is the homepage
  if (window.location.href === 'http://127.0.0.1:5000/') {
    chrome.runtime.sendMessage({ action: "getUserId" }, function(response) {
      if (response && response.userId) {
        // Send user ID to the Flask application
        fetch('http://localhost:5000/receive-user-id', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: response.userId })
        })
        .then(response => response.json())
        .then(data => {
          // Log the response from Flask
          console.log('Received response from Flask:', data);
        })
        .catch(error => console.error('Error:', error));
      }
    });
  }
});

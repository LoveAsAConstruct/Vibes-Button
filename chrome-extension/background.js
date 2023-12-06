chrome.action.onClicked.addListener((tab) => {
  // When the extension icon is clicked, inject the overlay script into the current tab
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ['overlay.js']
  });
});


function logStorage() {
  chrome.storage.sync.get('openaiApiKey', function(data) {
      if (data.openaiApiKey) {
          console.log("Current OpenAI API Key:", data.openaiApiKey);
      } else {
          console.log("No OpenAI API Key found in storage.");
      }
  });
  chrome.storage.sync.get('userId', function(data) {
    if (data.userId) {
        console.log("Current userId Key:", data.userId);
    } else {
        console.log("No userId found in storage.");
    }
});
}

// Call the function to log the API key
logStorage();

// Inject content script 
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  // Check for a specific URL or condition
  console.log("listener added");
  console.log(tab.url);
  if (tab.url && tab.url.includes("5000")) {
    console.log("webmatch injection");
    // Inject the content script
    chrome.scripting.executeScript({
        target: { tabId: tabId },
        files: ['content.js']
    });
  }
});

console.log("test");
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  console.log("Message received in background script3 :", request);
  logStorage();
  if (request.action === "setUserId") {
    // Save the user ID in chrome.storage
    console.log('Setting UserId:', request.userId);
    chrome.storage.sync.set({ 'userId': request.userId }, function() {
        console.log('User ID saved:', request.userId);
    });
  } else if (request.action === "getUserId") {
      // Retrieve the user ID from chrome.storage
      console.log('Getting UserId:', request.userId);
      chrome.storage.sync.get('userId', function(data) {
          console.log('UserID Sending:', request.userId);
          sendResponse({ userId: data.userId || null });
      });
      return true; // Indicate that the response is asynchronous
  }
  if (request.action === "getApiKey") {
      console.log("reyreq");
      // Retrieve the API key from chrome.storage.sync
      chrome.storage.sync.get('openaiApiKey', function(data) {
          console.log("kereqfinished");
          sendResponse({ openaiApiKey: data.openaiApiKey || 'Key not found' });
      });
      return true; // Return true for asynchronous response
  } else if (request.action === "setApiKey") {
      console.log("Received API Key to save:", request.apiKey);

      // Save the API key in chrome.storage.sync
      chrome.storage.sync.set({ 'openaiApiKey': request.apiKey }, function() {
          console.log('API Key saved successfully');
          logCurrentOpenAIKey();
      });
      return true;
  }

  return false;
});


chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.contentScriptQuery == "queryChatGPT") {
      // Retrieve the API key from storage
      chrome.storage.sync.get(['openaiApiKey'], function(result) {
          if (result.openaiApiKey) {
            fetch('https://api.openai.com/v1/engines/ft:babbage-002:personal::8QPma3Bo/completions', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': 'Bearer ' +result.openaiApiKey  // Replace with your actual API key
              },
              body: JSON.stringify({
                  prompt: "You are a supportive assistant interpreting inputs as positive sayings. Input: '" +request.url +"'",   // Update this with your actual prompt
                  max_tokens: 125,
                  temperature: 1,
                  // Add any other parameters you might need
              })
            })
            
              .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok: ' + response.status +", " +response.statusText);
                }

                let apiCallData = {
                  user_id: 1,   // Replace with actual user ID
                  tokens: 125,  // Replace with the number of tokens used
                  url: request.url,  // Replace with the API URL
                  response: "e"
                  // Replace with the API response
                };

                // URL of your Flask endpoint
                let flaskEndpoint = 'http://localhost:5000/log-api-call';  // Replace with the actual URL of your Flask app

                fetch(flaskEndpoint, {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(apiCallData)
                })
                .then(response => response.json())
                .then(data => console.log('Success in flask push:', data))
                .catch((error) => console.error('Error in flask push:', error));

                // Example data to be logged
                return response.json();
              })
              .then(data => {
                  console.log('Response JSON:', data); // Log the JSON data
                  // Handle the JSON data
                  return data;  // Return the data for the next .then() block
              })
              .then(data => {
                  sendResponse({ reply: data.choices[0].text }); // Use the data here
              })
              .catch(error => {
                  console.error('Error during OpenAI API call:', error);
                  sendResponse({ error: error.message });
              });
          } else {
              console.error('API key not set in extension settings');
              sendResponse({ error: 'API key not set in extension settings' });
          }
      });
      return true; // indicates we want to send a response asynchronously
  }
});
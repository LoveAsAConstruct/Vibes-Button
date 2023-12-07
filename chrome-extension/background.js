chrome.action.onClicked.addListener((tab) => {
  // When the extension icon is clicked, inject the overlay script into the current tab
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ['overlay.js']
  });
});

function approximateTokenCount(text) {
  // Basic approximation: count spaces for words and add extra for potential sub-word tokens
  const wordCount = text.split(' ').length; // Count words (approximated by splitting by spaces)
  const extraTokensForSubwords = Math.floor(text.length / 8); // Rough estimate for sub-word tokens
  return wordCount + extraTokensForSubwords;
}

function sendDataToServer(apiTokens, apiUrl, apiResponse, userId) {
  console.log("sending data")
  let data = {
      user_id: userId,
      tokens: apiTokens,
      url: apiUrl,
      response: apiResponse
  };

  fetch('http://127.0.0.1:5000/api/store', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
  })
  .then(response => response.json())
  .then(data => {
      console.log('Success:', data);
  })
  .catch((error) => {
      console.error('Error:', error);
  });
}


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
    chrome.storage.sync.set({ 'userId': request.userId }, function() {
        console.log('User ID saved:', request.userId);
    });
  } else if (request.action === "getUserId") {
      // Retrieve the user ID from chrome.storage
      chrome.storage.sync.get('userId', function(data) {
          sendResponse({ userId: data.userId || null });
      });
      return true; // Indicate an asynchronous response
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
          logStorage();
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
              let apiUrl = request.url; // URL from the request
              let requestBody = {
                  prompt: "You are a supportive assistant interpreting inputs as positive sayings. Input: '" + request.url + "'", // Update this with your actual prompt
                  max_tokens: 125,
                  temperature: 1
              };

              fetch('https://api.openai.com/v1/engines/ft:babbage-002:personal::8QPma3Bo/completions', {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json',
                      'Authorization': 'Bearer ' + result.openaiApiKey
                  },
                  body: JSON.stringify(requestBody)
              })
              .then(response => {
                  if (!response.ok) {
                      throw new Error('Network response was not ok: ' + response.status + ", " + response.statusText);
                  }
                  return response.json();  // Convert to JSON
              })
              .then(data => {
                  console.log('Response JSON:', data); // Log the JSON data
                  sendResponse({ reply: data.choices[0].text }); // Send the data back to the content script

                  // Retrieve userId from Chrome storage
                  chrome.storage.sync.get(['userId'], function(result) {
                      if (result.userId) {
                          let userId = result.userId;
                          let apiResponseData = JSON.stringify(data.choices[0].text);
                          let datalist = apiResponseData.split(/\[\[(.*?)\]\]/).filter(Boolean);
                          datalist.sort((a, b) => b.length - a.length);
                          let apiResponse = datalist[0]; // Convert response data to string
                          let apiTokens = approximateTokenCount(apiResponse); // Token count
                          sendDataToServer(apiTokens, apiUrl, apiResponse, userId); // Send data to your server
                      } else {
                          console.error('UserId not found in Chrome storage');
                      }
                  });
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
      return true; // Indicates we want to send a response asynchronously
  }
});

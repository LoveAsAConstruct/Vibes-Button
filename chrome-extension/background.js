// Listener for extension icon click to inject the overlay script
chrome.action.onClicked.addListener((tab) => {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ['overlay.js']
  });
});

// Function to approximate the token count of a text
function approximateTokenCount(text) {
  const wordCount = text.split(' ').length;
  const extraTokensForSubwords = Math.floor(text.length / 8);
  return wordCount + extraTokensForSubwords;
}

// Function to send data to the server
function sendDataToServer(apiTokens, apiUrl, apiResponse, userId) {
  console.log("Sending data");
  let data = {
    user_id: userId,
    tokens: apiTokens,
    url: apiUrl,
    response: apiResponse
  };

  fetch('http://127.0.0.1:5000/api/store', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  .then(response => response.json())
  .then(data => console.log('Success:', data))
  .catch(error => console.error('Error:', error));
}

// Function to log stored keys in chrome.storage
function logStorage() {
  chrome.storage.sync.get(['openaiApiKey', 'userId'], function(data) {
    console.log(data.openaiApiKey ? "Current OpenAI API Key: " + data.openaiApiKey : "No OpenAI API Key found in storage.");
    console.log(data.userId ? "Current userId: " + data.userId : "No userId found in storage.");
  });
}

// Inject content script based on specific URL conditions
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  console.log("Tab updated, URL: ", tab.url);
  if (tab.url && tab.url.includes("5000")) {
    chrome.scripting.executeScript({
      target: { tabId: tabId },
      files: ['content.js']
    });
  }
});

// Main message listener to handle various actions
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  logStorage();

  switch (request.action) {
    case "setUserId":
      chrome.storage.sync.set({ 'userId': request.userId }, () => {
        console.log('User ID saved:', request.userId);
      });
      break;

    case "getUserId":
      chrome.storage.sync.get('userId', (data) => {
        sendResponse({ userId: data.userId || null });
      });
      return true; // Asynchronous response

    case "setApiKey":
      chrome.storage.sync.set({ 'openaiApiKey': request.apiKey }, () => {
        console.log('API Key saved successfully');
      });
      return true;

    case "getApiKey":
      chrome.storage.sync.get('openaiApiKey', (data) => {
        sendResponse({ openaiApiKey: data.openaiApiKey || 'Key not found' });
      });
      return true;
  }

  if (request.contentScriptQuery === "queryChatGPT") {
    handleChatGPTQuery(request, sendResponse);
    return true; // Asynchronous response
  }

  return false; // Indicates synchronous response
});

// Function to handle ChatGPT query
function handleChatGPTQuery(request, sendResponse) {
  chrome.storage.sync.get(['openaiApiKey', 'userId'], function(result) {
    if (!result.openaiApiKey) {
      sendResponse({ error: 'API key not set in extension settings' });
      return;
    }

    let apiUrl = request.url;
    let requestBody = {
      prompt: "You are a supportive assistant interpreting inputs as positive sayings. Input: '" + apiUrl + "'",
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
      return response.json();
    })
    .then(data => {
      sendResponse({ reply: data.choices[0].text });
      let apiResponse = JSON.stringify(data.choices[0].text);
      let apiTokens = approximateTokenCount(apiResponse);
      sendDataToServer(apiTokens, apiUrl, apiResponse, result.userId);
    })
    .catch(error => {
      sendResponse({ error: error.message });
    });
  });
}

chrome.action.onClicked.addListener((tab) => {
  // When the extension icon is clicked, inject the overlay script into the current tab
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ['overlay.js']
  });
});
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.contentScriptQuery == "queryChatGPT") {
      // Retrieve the API key from storage
      chrome.storage.sync.get(['openaiApiKey'], function(result) {
          if (result.openaiApiKey) {
            fetch('https://api.openai.com/v1/engines/ft:babbage-002:personal::8Oq8nTwn/completions', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': 'Bearer ' +result.openaiApiKey  // Replace with your actual API key
              },
              body: JSON.stringify({
                  prompt: "You are a supportive assistant interpreting inputs as positive sayings. Input: '" +request.url +"'",   // Update this with your actual prompt
                  max_tokens: 125,
                  temperature: 0.7,
                  // Add any other parameters you might need
              })
            })
              .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok: ' + response.status +", " +response.statusText);
                }
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
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
            fetch('https://api.openai.com/v1/assistants/asst_F1FiCl5BjENBeQxbwEfHj6lL', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': 'Bearer API-KEY'   // Replace with your actual API key     
              },
              body: JSON.stringify({
                  messages: [
                      { role: "system", content: 'You are a supportive assistant who takes whatever input given to them and interprets said input (whether it be URLs or text) as a single sentence, positive, supportive, happy-go-lucky, joyous, saying. Not unlike a fortune cookie'},
                      { role: "user", content: request.url }
                  ]
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
document.addEventListener('DOMContentLoaded', function() {
    // Load the current API key from storage
    chrome.storage.sync.get('openaiApiKey', function(data) {
        document.getElementById('api-key').value = data.openaiApiKey || '';
    });

    // Save the API key when the button is clicked
    document.getElementById('save').addEventListener('click', function() {
        var apiKey = document.getElementById('api-key').value;
        chrome.storage.sync.set({ 'openaiApiKey': apiKey }, function() {
            console.log('API Key saved');
            // You can also notify the user that the API key was saved successfully
        });
    });
});

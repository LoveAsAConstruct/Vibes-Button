document.addEventListener('DOMContentLoaded', function() {
    console.log("DOMContentLoaded - Script loaded");

    // Function to send a message to the extension's content script
    function sendMessageToExtension(message) {
        console.log("Sending message to extension:", message);
        window.postMessage({ type: "FROM_PAGE", message: message }, "*");
    }

    // Function to verify the API key
    function verifyApiKey(apiKey, callback) {
        console.log("Verifying API Key:", apiKey);
        fetch('https://api.openai.com/v1/models', {
            headers: {
                'Authorization': `Bearer ${apiKey}`
            }
        }).then(response => {
            console.log("API response received:", response);
            if (response.ok) {
                callback(true); // API key is valid
            } else {
                callback(false); // API key is invalid
            }
        }).catch(error => {
            console.error('Error during API request:', error);
            callback(false); // Error occurred, treat as invalid API key
        });
    }

    // Function to update the error message display
    function updateErrorMessage(show) {
        console.log("Updating error message display:", show);
        const errorMessage = document.getElementById('error-message');
        errorMessage.style.visibility = show ? 'visible' : 'hidden';
        errorMessage.style.opacity = show ? '1' : '0';
    }

    // Function to show/hide the loading spinner
    function setLoading(isLoading) {
        console.log("Setting loading state:", isLoading);
        const button = document.getElementById('save');
        if (isLoading) {
            button.classList.add('loading');
        } else {
            button.classList.remove('loading');
        }
    }

    // Save the API key when the button is clicked
    document.getElementById('save').addEventListener('click', function() {
        var apiKey = document.getElementById('api-key').value;
        console.log("Save button clicked. API Key to save:", apiKey);

        setLoading(true); // Show loading spinner

        // Verify the API key before saving
        verifyApiKey(apiKey, function(isValid) {
            setLoading(false); // Hide loading spinner

            if (isValid) {
                console.log("API Key is valid. Saving to extension storage.");
                sendMessageToExtension({ action: "setApiKey", apiKey: apiKey });
            } else {
                console.log("Invalid API Key");
                updateErrorMessage(true); // Show error message
            }
        });
    });

    // Listen for messages from the content script
    window.addEventListener("message", function(event) {
        if (event.source === window && event.data.type === "FROM_EXTENSION") {
            // Handle the message from the extension
            if (event.data.message === 'apiKeySaved') {
                console.log('API Key saved');
                updateErrorMessage(false); // Hide error message
            }
        }
    });

    // Hide the error message when the user starts typing a new key
    document.getElementById('api-key').addEventListener('input', function() {
        console.log("Input event on API Key field.");
        updateErrorMessage(false);
    });
});

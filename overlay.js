// Add the CSS file to the head of the document

const link = document.createElement('link');
link.href = chrome.runtime.getURL('overlay.css');
link.type = 'text/css';
link.rel = 'stylesheet';
document.head.appendChild(link);

console.log("Script loaded");
console.log('Current URL:', window.location.href); // Get current page URL
var url;
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.url) {
        console.log("Current URL:", request.url);
        url = request.url;
        // Your existing overlay code
        // ...
    }
});

fetch(chrome.runtime.getURL('overlay.html'))
  .then(response => response.text())
  .then(data => {
    const div = document.createElement('div');
    div.innerHTML = data;
    document.body.appendChild(div);

    
    var collapseButton = document.getElementById('collapse-button');
    var expandButton = document.getElementById('expand-button');
    var popupContent = document.getElementById('button-container');
    var activationButton = document.getElementById('activation-button');
    var textBox = document.getElementById('text-box');
    collapseButton.addEventListener('click', function() {
        popupContent.style.display = 'none';
        textBox.style.display = 'none';  // Hide the text box
        expandButton.style.display = 'block';
    });

    expandButton.addEventListener('click', function() {
        popupContent.style.display = 'block';
        textBox.style.display = 'inline-block';  // Show the text box (or 'block')
        expandButton.style.display = 'none';
    });
    activationButton.addEventListener('click', function() {
        // Get the current URL
        var currentUrl = window.location.href;
    
        // Find the text box element
        var textBox = document.getElementById('text-box');
    
        // Set the text box content to the current URL
        if (textBox) {
            console.log("url set")
            textBox.textContent = currentUrl +"...";
        } else {
            console.error('Text box element not found');
        }
        chrome.runtime.sendMessage({
            contentScriptQuery: "queryChatGPT",
            url: currentUrl
        }, response => {
            // Check if textBox exists
            if (!textBox) {
                console.error('Text box element not found');
                return;
            }
        
            // Check for response and any errors
            if (response) {
                if (response.reply) {
                    // Use the reply from the background script
                    console.log(response);
                    response_chunks = response.reply.split("'");
                    response_chunks.sort((a, b) => b.length - a.length);
                    textBox.textContent = response_chunks[0];
                } else if (response.error) {
                    // Handle any error sent from the background script
                    console.error('Error from background script:', response.error);
                    textBox.textContent = 'Error: ' + response.error;
                }
            } else {
                // Handle the case where response is undefined
                console.error('No response received from background script');
                textBox.textContent = 'No response received';
            }
        });        
    });
    })
  .catch(err => console.error('Error loading the overlay:', err));

  
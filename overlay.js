// Add the CSS file to the head of the document

const link = document.createElement('link');
link.href = chrome.runtime.getURL('overlay.css');
link.type = 'text/css';
link.rel = 'stylesheet';
document.head.appendChild(link);
console.log("Script loaded");
console.log('Current URL:', window.location.href); // Get current page URL
var url;
var requesting = false;
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.url) {
        console.log("Current URL:", request.url);
        url = request.url;
        // Your existing overlay code
        // ...
    }
});

function removeSpecialCharacters(inputString) {
    // Define a regular expression to match special characters
    const specialCharRegex = /[^a-zA-Z0-9\s.,?!'"():;]/g;
  
    // Use the replace() method to remove special characters
    const cleanedString = inputString.replace(specialCharRegex, '');
  
    return cleanedString;
  }

fetch(chrome.runtime.getURL('overlay.html'))
  .then(response => response.text())
  .then(data => {
    const div = document.createElement('div');
    div.innerHTML = data;
    document.body.appendChild(div);

    
    const collapseButton = document.getElementById('collapse-button');
    const expandButton = document.getElementById('expand-button');
    const popupContent = document.getElementById('button-container');
    const activationButton = document.getElementById('activation-button');
    const textBox = document.getElementById('text-box');
    const buttonContainer = document.querySelector(".button-container");
    const hoverButton = document.getElementById('hover-button');
    const originalHeight = buttonContainer.offsetHeight; // Store the original height

    

    // Add a click event listener for the hover button
    hoverButton.addEventListener("click", function () {
        // Handle the click event of the hover button here
        console.log("Hover button clicked!");
    });

    function revealText(text, object) {
        let index = 0;
        const interval = 10; // Interval between revealing each character (in milliseconds)
    
        function revealCharacter() {
            if (index < text.length) {
                object.textContent += text[index];
                index++;
                setTimeout(revealCharacter, interval);
            }
        }
    
        revealCharacter();
    }
    textBox.addEventListener('click', function() {
        textBox.innerText='';
    });
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
        if(!requesting){
            requesting = true;
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
            activationButton.classList.add('loading');
            chrome.runtime.sendMessage({
                contentScriptQuery: "queryChatGPT",
                url: currentUrl
            }, response => {
                // Check if textBox exists
                if (!textBox) {
                    console.error('Text box element not found');
                    requesting=false;
                    return;
                }
            
                // Check for response and any errors
                if (response) {
                    activationButton.classList.remove('loading');
                    if (response.reply) {
                        // Use the reply from the background script
                        console.log(response);
                        response_chunks = response.reply.split(/\[\[(.*?)\]\]/).filter(Boolean);
                        response_chunks.sort((a, b) => b.length - a.length);
                        textBox.innerText = '';
                        revealText(removeSpecialCharacters(response_chunks[0]), textBox);
                    } else if (response.error) {
                        // Handle any error sent from the background script
                        console.error('Error from background script:', response.error);
                        textBox.textContent = 'Error: ' + response.error;
                    }
                } else {
                    myButton.classList.remove('loading');
                    // Handle the case where response is undefined
                    console.error('No response received from background script');
                    textBox.textContent = 'No response received';
                }
                requesting=false;        
            });
        }
        else{
            return;
        }
    });
    })
    
  .catch(err => console.error('Error loading the overlay:', err));

  
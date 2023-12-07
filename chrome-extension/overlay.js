// Create and append a link to the CSS file in the document head
const link = document.createElement('link');
link.href = chrome.runtime.getURL('overlay.css');
link.type = 'text/css';
link.rel = 'stylesheet';
document.head.appendChild(link);

// Log script loading and current URL
console.log("Script loaded");
console.log('Current URL:', window.location.href);

let url;
let requesting = false;

// Listen for messages from the runtime
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.url) {
        console.log("Current URL:", request.url);
        url = request.url;
    }
});

// Function to remove special characters from a string
function removeSpecialCharacters(inputString) {
    return inputString.replace(/[^a-zA-Z0-9\s.,?!'"():;]/g, '');
}

// Load the HTML overlay and append to the body
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

        // Event listener for the hover button
        document.getElementById('hover-button').addEventListener("click", () => {
            console.log("Hover button clicked!");
        });

        // Function to reveal text character by character
        function revealText(text, object) {
            let index = 0;
            const interval = 10;
            function revealCharacter() {
                if (index < text.length) {
                    object.textContent += text[index++];
                    setTimeout(revealCharacter, interval);
                }
            }
            revealCharacter();
        }

        // Event listeners for various buttons
        textBox.addEventListener('click', () => textBox.innerText = '');
        collapseButton.addEventListener('click', () => {
            popupContent.style.display = 'none';
            textBox.style.display = 'none';
            expandButton.style.display = 'block';
        });
        expandButton.addEventListener('click', () => {
            popupContent.style.display = 'block';
            textBox.style.display = 'inline-block';
            expandButton.style.display = 'none';
        });

        // Event listener for the activation button
        activationButton.addEventListener('click', () => {
            if (requesting) return;
            requesting = true;

            const currentUrl = window.location.href;
            textBox.textContent = currentUrl + "...";
            activationButton.classList.add('loading');

            chrome.runtime.sendMessage({ contentScriptQuery: "queryChatGPT", url: currentUrl }, response => {
                if (!textBox) {
                    console.error('Text box element not found');
                    requesting = false;
                    return;
                }
                if (response) {
                    activationButton.classList.remove('loading');
                    if (response.reply) {
                        const responseChunks = response.reply.split(/\[\[(.*?)\]\]/).filter(Boolean);
                        responseChunks.sort((a, b) => b.length - a.length);
                        textBox.innerText = '';
                        revealText(removeSpecialCharacters(responseChunks[0]), textBox);
                    } else if (response.error) {
                        console.error('Error from background script:', response.error);
                        textBox.textContent = 'Error: ' + response.error;
                    }
                } else {
                    activationButton.classList.remove('loading');
                    console.error('No response received from background script');
                    textBox.textContent = 'No response received';
                }
                requesting = false;        
            });
        });
    })
    .catch(err => console.error('Error loading the overlay:', err));

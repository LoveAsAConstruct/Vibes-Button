// Add the CSS file to the head of the document

const link = document.createElement('link');
link.href = chrome.runtime.getURL('overlay.css');
link.type = 'text/css';
link.rel = 'stylesheet';
document.head.appendChild(link);

console.log("Script loaded");


fetch(chrome.runtime.getURL('overlay.html'))
  .then(response => response.text())
  .then(data => {
    const div = document.createElement('div');
    div.innerHTML = data;
    document.body.appendChild(div);

    
    var collapseButton = document.getElementById('collapse-button');
    var expandButton = document.getElementById('expand-button');
    var popupContent = document.getElementById('button-container');
    console.log("buttons defined");
    collapseButton.addEventListener('click', function() {
        console.log("collapse")
        // Hide everything in the popup except the expand button
        Array.from(popupContent.children).forEach(child => {
            if (child !== collapseButton) {
                child.style.display = 'none';
            }
        });
        popupContent.style.display='none';
        expandButton.style.display = 'block'; // Show expand button
    });

    expandButton.addEventListener('click', function() {
        console.log("expand")
        // Show all popup content
        Array.from(popupContent.children).forEach(child => {
            child.style.display = '';
        });
        popupContent.style.display='';
        expandButton.style.display = 'none'; // Hide expand button
    });
    })
  .catch(err => console.error('Error loading the overlay:', err));
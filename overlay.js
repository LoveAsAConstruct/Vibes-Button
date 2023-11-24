// Add the CSS file to the head of the document
const link = document.createElement('link');
link.href = chrome.runtime.getURL('overlay.css');
link.type = 'text/css';
link.rel = 'stylesheet';
document.head.appendChild(link);

fetch(chrome.runtime.getURL('overlay.html'))
  .then(response => response.text())
  .then(data => {
    const div = document.createElement('div');
    div.innerHTML = data;
    document.body.appendChild(div);
  })
  .catch(err => console.error('Error loading the overlay:', err));

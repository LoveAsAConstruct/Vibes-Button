document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault();

    // Extract credentials from form
    const formData = new FormData(event.target);
    const username = formData.get('username');
    const password = formData.get('password');

    // Perform AJAX request to your Flask server for authentication
    fetch('/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            // Send a message to the extension's content script
            window.postMessage({ type: "FROM_PAGE", action: "setUserId", userId: userId }, "*");
        } else {
            // Handle error
            console.error('Login failed:', data.message);
        }
    })
    .catch(error => console.error('Error:', error));
});

// Function to send a message to the extension's content script
function sendMessageToExtension(message) {
    window.postMessage({ type: "FROM_PAGE", message: message }, "*");
}
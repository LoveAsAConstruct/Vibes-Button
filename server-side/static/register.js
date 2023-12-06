document.getElementById('register-form').addEventListener('submit', function(event) {
    event.preventDefault();

    // Extract registration data from form
    const formData = new FormData(event.target);
    const username = formData.get('username');
    const password = formData.get('password');

    // Perform AJAX request to Flask server for registration
    fetch('/api/register', {
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
            sendMessageToExtension({ action: "setUserId", userId: data.user_id });
        } else {
            // Handle error
            console.error('Registration failed:', data.message);
        }
    })
    .catch(error => console.error('Error:', error));
});

// Function to send a message to the extension's content script
function sendMessageToExtension(message) {
    window.postMessage({ type: "FROM_PAGE", message: message }, "*");
}
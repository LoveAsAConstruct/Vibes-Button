document.addEventListener('DOMContentLoaded', function() {
    // Check user login status and update UI accordingly
    checkUserLoginStatus();

    // Logout button click handler
    document.getElementById('logout-button').addEventListener('click', function() {
        logoutUser();
    });

    // API Key switch button click handler
    document.getElementById('switch-api-key-button').addEventListener('click', function() {
        switchToApiKeyOptions();
    });
});

function checkUserLoginStatus() {
    // Send request to Flask backend to check user login status
    fetch('/get_user_info')
        .then(response => response.json())
        .then(data => {
            if (data.is_logged_in) {
                // Update UI to show logged in user info
                document.getElementById('user-greeting').textContent = `Welcome ${data.username}!`;
            } else {
                // Redirect to login page if not logged in
                window.location.href = '/login';
            }
        })
        .catch(error => console.error('Error:', error));
}

function logoutUser() {
    // Send logout request to Flask backend
    fetch('/logout', { method: 'POST' })
        .then(response => response.json())
        .then(data => {
            if (data.status === "logged out") {
                // Redirect to login page after successful logout
                window.location.href = '/login';
            }
        })
        .catch(error => console.error('Error:', error));
}

function switchToApiKeyOptions() {
    // Redirect to API key options page
    window.location.href = '/options';
}
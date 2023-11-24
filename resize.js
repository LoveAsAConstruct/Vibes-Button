console.log("Script loaded");

document.addEventListener('DOMContentLoaded', function() {
    var collapseButton = document.getElementById('collapse-button');

    if (collapseButton) {
        collapseButton.addEventListener('click', function() {
            console.log("Button clicked");
            var container = document.getElementById('button-container'); // Corrected way to get the container

            // Toggle visibility
            if (container.style.display === 'none') {
                container.style.display = 'block';
            } else {
                container.style.display = 'none';
            }
        });
    } else {
        console.log("Collapse button not found");
    }
});
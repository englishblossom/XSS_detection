document.addEventListener('DOMContentLoaded', function() {
    const statusDiv = document.getElementById('status');
    
    // Listen for messages from the background script
    chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
        if (message.alert) {
            statusDiv.textContent = 'Malicious script detected!';
            statusDiv.style.color = 'red';
        } else {
            statusDiv.textContent = 'No malicious scripts detected.';
            statusDiv.style.color = 'green';
        }
    });

    // Send a message to the background script to check the current tab
    chrome.runtime.sendMessage({command: "check_page"}, function(response) {
        if (response && response.found) {
            statusDiv.textContent = 'Malicious script detected!';
            statusDiv.style.color = 'red';
        } else {
            statusDiv.textContent = 'Scanning...';
            statusDiv.style.color = 'black';
        }
    });
});

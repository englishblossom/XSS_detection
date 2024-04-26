chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.command === "check_page") {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            const currentTab = tabs[0];
            if (currentTab) {
                chrome.scripting.executeScript({
                    target: {tabId: currentTab.id},
                    function: scrapeContent
                }, (injectionResults) => {
                    for (const frameResult of injectionResults) {
                        checkForXSS(frameResult.result, sendResponse);
                    }
                });
            }
        });
        return true; // Keep the message channel open for asynchronous response
    }
});

function scrapeContent() {
    return document.body.innerHTML;
}

function checkForXSS(pageContent, callback) {
    fetch('https://yourmodelapi.com/detect', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({content: pageContent})
    })
    .then(response => response.json())
    .then(data => {
        if (data.isMalicious) {
            chrome.runtime.sendMessage({alert: true});
            callback({found: true});
        } else {
            callback({found: false});
        }
    }).catch(error => {
        console.error('Error checking for XSS:', error);
        callback({found: false});
    });
}

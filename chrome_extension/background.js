chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    fetch('https://yourapi.com/endpoint', { // Update this URL to our real endpoint
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({url: request.url})
    })
    .then(response => response.json())
    .then(data => sendResponse({success: true, data: data}))
    .catch(error => {
        console.error('Error:', error);
        sendResponse({success: false, error: error.message});
    });
    return true;  
});
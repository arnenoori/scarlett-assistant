chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    fetch('https://yourapi.com/endpoint', { // Just need to change this call out own API
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({url: request.url})
    })
    .then(response => response.json())
    .then(data => sendResponse(data))
    .catch(error => console.error('Error:', error));
    return true;
});


chrome.runtime.onMessage.addListener(async function(request, sender, sendResponse) {
    const url = request.url;
    console.log("Received URL: ", request.url);

    if (!url || !/^(https?:\/\/)?[^\s/$.?#].[^\s]*$/i.test(url)) {
        sendResponse({ error: 'Invalid website URL' });
        return;
    }

    try {
        const response = await fetch('http://www.tosbuddy.com/findTos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url: url }),
        });

        if (response.ok) {
            const data = await response.json();
            sendResponse({ data: data });
        } else {
            console.error('Error with the API:', response.statusText);
            sendResponse({ error: 'Error fetching data' });
        }
    } catch (error) {
        console.error('Fetch error:', error);
        sendResponse({ error: error.message });
    }

    return true; 
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    const url = request.url;
    console.log("Received URL:", url);

    if (!url || !/^(https?:\/\/)?[^\s/$.?#].[^\s]*$/i.test(url)) {
        console.error('Invalid URL provided:', url);
        sendResponse({ error: 'Invalid website URL' });
        return;
    }

    (async () => {
        try {
            const response = await fetch('http://localhost:3000/api/summaryTos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ url: url }),
            });

            if (response.ok) {
                let data = await response.text(); 
                sendResponse({ data: data });
            } else {
                console.error('Error with the API:', response.statusText);
                sendResponse({ error: 'Error fetching data' });
            }
        } catch (error) {
            console.error('Fetch error:', error);
            sendResponse({ error: error.message });
        }
    })();

    return true;
});

document.addEventListener('DOMContentLoaded', function () {
    var sendUrlButton = document.getElementById('sendUrl');
    var loadingIndicator = document.getElementById('loadingIndicator'); 

    sendUrlButton.addEventListener('click', function() {
        loadingIndicator.style.display = 'block'; 

        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            var currentTab = tabs[0];

            console.log('Sending message to background script with URL:', currentTab.url);

            chrome.runtime.sendMessage({url: currentTab.url}, function(response) {
                loadingIndicator.style.display = 'none'; 

                if (chrome.runtime.lastError) {
                    console.error('Runtime error:', chrome.runtime.lastError.message);
                    return;
                }

                if (response && response.data) {
                    console.log('Received response from background script:', response);
                    const cleanedTitle = cleanTitle(currentTab.title) || currentTab.url;
                    document.getElementById('websiteTitle').textContent = cleanedTitle;
                    displayResponse(response.data); // Use response.data directly
                    document.getElementById('apiResponseContainer').style.display = 'block'; 
                } else {
                    console.error('Failed to receive response from background script.');
                }
            });
        });
    });
});

function cleanTitle(title) {
    if (!title) return '';
    // Remove leading numeric prefixes and surrounding parentheses
    return title.replace(/^\(\d+\)\s*/, '');
}

function displayResponse(data) {
    if (!data) {
        console.error('Invalid data format:', data);
        return;
    }

    const summary = data.summary || {};
    const potentialDangers = data.potentialDangers || [];
    const overallAssessment = data.overallAssessment || 'No overall assessment available.';

    const responseText = `
        Summary: ${JSON.stringify(summary, null, 2)}
        Potential Dangers: ${potentialDangers.join(', ')}
        Overall Assessment: ${overallAssessment}
    `;

    document.getElementById('apiResponse').textContent = responseText;
}

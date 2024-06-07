document.addEventListener('DOMContentLoaded', function () {
    var sendUrlButton = document.getElementById('sendUrl');
    var loadingIndicator = document.getElementById('loadingIndicator'); 
    var addWebsiteButton = document.getElementById('addWebsite'); // New button
    var confirmationMessage = document.getElementById('confirmationMessage'); // Confirmation message

    sendUrlButton.addEventListener('click', function() {
        loadingIndicator.style.display = 'block'; 

        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            var currentTab = tabs[0];

            console.log('Sending message to background script with URL:', currentTab.url);

            chrome.runtime.sendMessage({url: currentTab.url}, function(response) {
                loadingIndicator.style.display = 'none'; 

                if (chrome.runtime.lastError) {
                    console.error('Runtime error:', chrome.runtime.lastError.message);
                    displayNoInfoMessage();
                    return;
                }

                if (response && response.data) {
                    console.log('Received response from background script:', response);
                    const cleanedTitle = cleanTitle(currentTab.title) || currentTab.url;
                    document.getElementById('websiteTitle').textContent = cleanedTitle;

                    let responseData = response.data;

                    // Remove the first 5 characters and new lines
                    responseData = responseData.substring(5).replace(/\n/g, '');

                    try {
                        const parsedData = JSON.parse(responseData);
                        displayResponse(parsedData); 
                        document.getElementById('apiResponseContainer').style.display = 'block'; 
                    } catch (e) {
                        console.error('Error parsing JSON:', e);
                        displayNoInfoMessage();
                    }
                } else {
                    console.error('Failed to receive response from background script.');
                    displayNoInfoMessage();
                }
            });
        });
    });

    addWebsiteButton.addEventListener('click', function() {
        confirmationMessage.style.display = 'block';
        setTimeout(() => {
            confirmationMessage.style.display = 'none';
        }, 3000); // Hide the message after 3 seconds
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

    const apiResponseElement = document.getElementById('apiResponse');
    apiResponseElement.innerHTML = ''; 

    const summarySection = document.createElement('div');
    summarySection.innerHTML = '<strong>Summary:</strong><br>' + 
        Object.entries(summary).map(([key, value]) => `<strong>${key}:</strong> ${value}`).join('<br>');

    const potentialDangersSection = document.createElement('div');
    potentialDangersSection.innerHTML = '<strong>Potential Dangers:</strong><br>' + potentialDangers.join('<br>');

    const overallAssessmentSection = document.createElement('div');
    overallAssessmentSection.innerHTML = '<strong>Overall Assessment:</strong><br>' + overallAssessment;

    apiResponseElement.appendChild(summarySection);
    apiResponseElement.appendChild(potentialDangersSection);
    apiResponseElement.appendChild(overallAssessmentSection);
}

function displayNoInfoMessage() {
    const apiResponseElement = document.getElementById('apiResponse');
    apiResponseElement.innerHTML = '<strong>No information is available about this site.</strong>';
    document.getElementById('apiResponseContainer').style.display = 'block';
}

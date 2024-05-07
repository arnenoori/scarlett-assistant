document.addEventListener('DOMContentLoaded', function () {
    var sendUrlButton = document.getElementById('sendUrl');
    var loadingIndicator = document.getElementById('loadingIndicator'); 

    sendUrlButton.addEventListener('click', function() {
        loadingIndicator.style.display = 'block'; 
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            var currentTab = tabs[0];
            chrome.runtime.sendMessage({url: currentTab.url}, function(response) {
                loadingIndicator.style.display = 'none'; 
                if(response) { 
                    document.getElementById('websiteTitle').textContent = currentTab.title || currentTab.url;
                    document.getElementById('tosSummary').textContent = response.tosSummary || 'No summary available';
                    document.getElementById('tosDetails').textContent = response.tosDetails || 'No details available';
                    document.getElementById('userRights').textContent = response.userRights || 'No user rights info available';
                    document.getElementById('dataCollection').textContent = response.dataCollection || 'No data collection info available';
                    document.getElementById('limitationsLiability').textContent = response.limitationsLiability || 'No data available for Limitations of Liability';
                    document.getElementById('apiResponse').style.display = 'block'; 
                } else {
                    console.error('Failed to receive response from background script.');
                }
            });
        });
    });
});

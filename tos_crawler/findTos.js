const { PlaywrightCrawler, RequestQueue } = require('crawlee');
const fs = require('fs');
const path = require('path');
const url = require('url');

// Function to generate filename based on website name and document title
function generateFilename(urlString, pageTitle) {
    const urlObj = new URL(urlString);
    // Extract the hostname and then take the root domain name without the TLD
    let domainParts = urlObj.hostname.replace('www.', '').split('.');
    // Ensure that we capture longer TLDs (e.g., .co.uk) by taking the second-to-last part if domainParts has more than 2 elements
    const siteName = domainParts.length > 2 ? domainParts[domainParts.length - 2] : domainParts[0];

    let label = pageTitle.split(' – ')[0].toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/(^_+|_+$)/g, ''); // Simplifies the title to a filename-friendly format

    // Special handling for "Terms of Service" to abbreviate as "tos"
    if (label.includes('terms_of_service') || label.includes('terms')) {
        label = 'tos';
    } else if (label.includes('privacy_policy') || label.includes('privacy')) {
        label = 'privacy_policy';
    }

    return `${siteName}_${label}.txt`;
}

// Function to save text content to a file
function saveToTextFile(filename, content) {
    fs.writeFileSync(path.join(__dirname, filename), content, { encoding: 'utf8' });
}

// Main logic wrapped in an async function to use await
async function main() {
    const requestQueue = await RequestQueue.open();

    const crawler = new PlaywrightCrawler({
        requestQueue,

        async requestHandler({ request, page, enqueueLinks }) {
            if (request.userData.isTosPage) {
                const pageTitle = await page.title();
                const textContent = await page.evaluate(() => document.body.innerText);
                const filename = generateFilename(request.url, pageTitle);
                saveToTextFile(filename, textContent);
                console.log(`Saved ToS text content to ${filename}`);
            } else {
                const pageTitle = await page.title();
                console.log(`Title of ${request.url}: ${pageTitle}`);

                // Extract ToS links and enqueue them for processing
                const tosLinks = await page.$$eval('a', (anchors) =>
                    anchors.filter(a => /terms|tos|privacy/i.test(a.textContent) || /terms|tos|privacy/i.test(a.href))
                           .map(a => a.href)
                );

                for (const link of tosLinks) {
                    await requestQueue.addRequest({ url: link, userData: { isTosPage: true } });
                }
            }
        },

        async failedRequestHandler({ request }) {
            console.error(`Request ${request.url} failed too many times.`);
        },
    });

    await requestQueue.addRequest({ url: 'https://google.com', userData: { isTosPage: false } });
    await crawler.run();
}

main().catch(console.error);

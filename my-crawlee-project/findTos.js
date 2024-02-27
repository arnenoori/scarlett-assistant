const { PlaywrightCrawler, Dataset } = require('crawlee');

// Main crawler function
const crawler = new PlaywrightCrawler({
    async requestHandler({ page, request }) {
        const pageTitle = await page.title();
        console.log(`Title of ${request.url}: ${pageTitle}`);

        // Redefine the isTosLink function inside the $$eval to make it available in the browser context
        const links = await page.$$eval('a', (anchors) => {
            const isTosLink = (linkText, url) => {
                const patterns = /terms|tos|terms of service|legal|privacy/i;
                return patterns.test(linkText) || patterns.test(url);
            };

            return anchors.map(anchor => ({ href: anchor.href, text: anchor.textContent.trim() }))
                          .filter(link => isTosLink(link.text, link.href));
        });

        // Log found ToS links (or indicate none were found)
        if (links.length > 0) {
            console.log('Terms of Service or related link(s) found:', links);
            // Optionally, follow the ToS link to scrape its content
            // This might involve enqueuing the link for another requestHandler specific to ToS content extraction
            links.forEach(link => {
                console.log(`Found ToS or related link: ${link.href}`);
                // Here you could enqueue the link for further processing
                // enqueueLinks({ url: link.href }); // Uncomment and modify as needed
            });
        } else {
            console.log('No ToS or related links found on this page.');
        }

        // For demonstration, we're just adding the pageTitle to a dataset.
        // In a real scenario, you might want to save the ToS content instead.
        await Dataset.pushData({ url: request.url, pageTitle });
        
    },

    // Function to handle failed requests
    failedRequestHandler({ request }) {
        console.error(`Request ${request.url} failed too many times.`);
    },

    // Additional settings can go here, like maxConcurrency, requestTimeouts, etc.
});

// Function to start the crawler
(async () => {
    // Replace 'https://example.com' with the target URL or an array of URLs to start crawling from
    await crawler.run(['https://google.com']);
})();

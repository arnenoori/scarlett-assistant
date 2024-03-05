const { PlaywrightCrawler, RequestQueue } = require('crawlee');
const fs = require('fs');
const path = require('path');
const https = require('https');
const url = require('url'); // For URL manipulation

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// Normalize URL to its domain root
function normalizeUrlToRoot(inputUrl) {
    const urlObj = new URL(inputUrl);
    return `${urlObj.protocol}//${urlObj.hostname}`;
}

// Download favicon
function downloadFavicon(domain, callback) {
    const faviconUrl = `${domain}/favicon.ico`;
    const filename = path.join(__dirname, `${new URL(domain).hostname}_favicon.ico`);
    
    https.get(faviconUrl, (res) => {
        if (res.statusCode === 200) {
            const fileStream = fs.createWriteStream(filename);
            res.pipe(fileStream);
            fileStream.on('finish', () => {
                fileStream.close();
                console.log(`Downloaded favicon to ${filename}`);
                if (callback) callback(filename);
            });
        } else {
            console.log(`Failed to download favicon from ${faviconUrl}`);
            if (callback) callback(null);
        }
    }).on('error', (err) => {
        console.error(`Error downloading favicon from ${faviconUrl}: ${err.message}`);
        if (callback) callback(null);
    });
}

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
function saveToTextFile(filename, content, websiteId, tosUrl) {
    fs.writeFileSync(path.join(__dirname, filename), content, { encoding: 'utf8' });

    // Insert into database
    const insertData = async () => {
        const { data, error } = await supabase
            .from('terms_of_service')
            .insert([
                { 
                    website_id: websiteId, 
                    content: content, 
                    simplified_content: '', // You'll need to generate this separately
                    tos_url: tosUrl
                }
            ]);

        if (error) {
            console.error('Error inserting ToS data into Supabase:', error.message);
        } else {
            console.log('ToS data inserted into Supabase:', data);
        }
    };

    insertData().catch(console.error);
}

// Main logic wrapped in an async function to use await
async function main() {
    const requestQueue = await RequestQueue.open();
    let initialUrl = 'https://www.example.com'; // Placeholder URL
    initialUrl = normalizeUrlToRoot(initialUrl);

    let { data: websiteData, error: websiteError } = await supabase
        .from('websites')
        .select('website_id')
        .eq('url', initialUrl);

    if (websiteError) {
        console.error('Error querying website from Supabase:', websiteError.message);
        return;
    }

    let websiteId;
    if (websiteData.length === 0) {
        const { data: insertData, error: insertError } = await supabase
            .from('websites')
            .insert([{ url: initialUrl, site_name: new URL(initialUrl).hostname }])
            .single(); // Use .single() to expect a single response object

        if (insertError) {
            console.error('Error inserting website into Supabase:', insertError.message);
            return;
        }

        if (!insertData || insertData.website_id === undefined) {
            console.error('Insert operation did not return expected data:', insertData);
            return;
        }

        websiteId = insertData.website_id;
    } else {
        websiteId = websiteData[0].website_id;
    }

    downloadFavicon(initialUrl); // Download and save favicon

    const crawler = new PlaywrightCrawler({
        requestQueue,

        async requestHandler({ request, page, enqueueLinks }) {
            if (request.userData.isTosPage) {
                const pageTitle = await page.title();
                const textContent = await page.evaluate(() => document.body.innerText);
                const filename = generateFilename(request.url, pageTitle);
                saveToTextFile(filename, textContent, websiteId, request.url);
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

    await requestQueue.addRequest({ url: initialUrl, userData: { isTosPage: false } });
    await crawler.run();
}

main().catch(console.error);
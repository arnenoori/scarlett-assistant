/* This file can be used to export functionality that can then be used in the
 * extension's content and background scripts.
 */

// index.ts
export async function getCurrentTab(): Promise<chrome.tabs.Tab> {
    return new Promise((resolve) => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        resolve(tabs[0]);
      });
    });
  }
  
  export async function sendUrlToApi(url: string): Promise<void> {
    try {
      const response = await fetch('https://tosbuddy.com/api/findTos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });
  
      if (response.ok) {
        console.log('URL sent to API successfully');
      } else {
        console.error('Error sending URL to API:', response.statusText);
      }
    } catch (error) {
      console.error('Error sending URL to API:', error);
    }
  }
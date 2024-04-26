// background.ts
/* This is the background script, also known as the service worker. */

import { getCurrentTab, sendUrlToApi } from './internal';

chrome.tabs.onUpdated.addListener(async (tabId: number, changeInfo: chrome.tabs.TabChangeInfo, tab: chrome.tabs.Tab) => {
  if (changeInfo.status === 'complete' && tab.active) {
    const currentTab = await getCurrentTab();
    const currentUrl = currentTab.url;

    if (currentUrl) {
      await sendUrlToApi(currentUrl);
    }
  }
});
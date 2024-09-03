let urlQueue = [];
let isProcessing = false;
let stopFlag = false;
let delay = 6000; // Default to 6 seconds

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'startOpening') {
    urlQueue = request.urls;
    delay = request.delay || 6000; // Use the provided delay or default to 6 seconds
    stopFlag = false;
    if (!isProcessing) {
      processNextUrl();
    }
    sendResponse({status: 'started'});
  } else if (request.action === 'stopOpening') {
    stopFlag = true;
    urlQueue = [];
    sendResponse({status: 'stopped'});
  }
  return true;
});

function processNextUrl() {
  if (stopFlag || urlQueue.length === 0) {
    isProcessing = false;
    chrome.runtime.sendMessage({action: 'processingComplete'});
    return;
  }

  isProcessing = true;
  const url = urlQueue.shift();

  // Open the tab in the background by setting active: false
  chrome.tabs.create({ url: url, active: false }, (tab) => {
    console.log(`Opened tab for URL: ${url}`);
    setTimeout(() => {
      processNextUrl();
    }, delay); // Use the delay specified by the user
  });
}

const startStopButton = document.getElementById('startStopButton');
const statusMessage = document.getElementById('statusMessage');

startStopButton.addEventListener('click', () => {
    const isStarting = startStopButton.textContent === 'Start';
    const urls = document.getElementById('urlInput').value.split(',').map(url => url.trim()).filter(url => url);
    const delay = parseInt(document.getElementById('delayInput').value, 10) * 1000; // Convert to milliseconds

    if (isStarting) {
        if (urls.length === 0) {
            alert('Please enter valid URLs.');
            return;
        }

        startStopButton.textContent = 'Stop';
        startStopButton.classList.add('stop');
        statusMessage.textContent = 'Opening links...';

        chrome.runtime.sendMessage({ action: 'startOpening', urls: urls, delay: delay }, (response) => {
            console.log(response.status);
        });
    } else {
        chrome.runtime.sendMessage({ action: 'stopOpening' }, (response) => {
            console.log(response.status);
        });

        startStopButton.textContent = 'Start';
        startStopButton.classList.remove('stop');
        statusMessage.textContent = 'Stopped. Ready to start again.';
    }
});

document.getElementById('coffeeButton').addEventListener('click', () => {
    window.open('https://www.buymeacoffee.com/afsalmadathingal', '_blank');
});

chrome.runtime.onMessage.addListener((message) => {
    if (message.action === 'processingComplete') {
        startStopButton.textContent = 'Start';
        startStopButton.classList.remove('stop');
        statusMessage.textContent = 'All links opened. Ready to start again.';
    }
});

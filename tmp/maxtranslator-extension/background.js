chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.text) {
        console.log("Received highlighted text:", message.text);
        // Perform actions, like storing the text or showing a notification
    }
});
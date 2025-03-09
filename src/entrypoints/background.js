export default defineBackground(() => {
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        if (message.type === "SAVE_TOKEN") {
            chrome.storage.local.set({ accessToken: message.token }, () => {
                sendResponse({ success: true });
            });
            chrome.storage.local.set({ isOauth: true })
            return true; // Permet d'utiliser sendResponse de manière asynchrone
        }
    });
    
    
});

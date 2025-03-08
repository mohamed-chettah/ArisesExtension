export default defineBackground(() => {
    // chrome.runtime.onInstalled.addListener(() => {
    //     chrome.sidePanel.setOptions({ enabled: true });
    // });
    
    // chrome.action.onClicked.addListener(async (tab) => {
    //     const isAvailable = await chrome.sidePanel.isAvailable({ tabId: tab.id });
        
    //     if (isAvailable) {
    //         chrome.sidePanel.open({ tabId: tab.id });
    //     } else {
    //         console.warn("Side Panel non disponible sur cette page");
    //     }
    // });
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        if (message.type === "SAVE_TOKEN") {
            chrome.storage.local.set({ accessToken: message.token }, () => {
                console.log("✅ Token enregistré :", message.token);
                sendResponse({ success: true });
            });
            return true; // Permet d'utiliser sendResponse de manière asynchrone
        }
    });
    
    
});

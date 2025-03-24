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

    let timerInterval;
    let pomodoroState = {};


    // Écoute des messages du front (popup)
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        if (message.action === "start-timer") {
            if(pomodoroState === {}){
                return;
            }
            clearInterval(timerInterval);
            pomodoroState = message.datas
            timerInterval = setInterval(() => {
                pomodoroState.totalSeconds--;
                if (pomodoroState.totalSeconds <= 1) {
                    clearInterval(timerInterval);
                    chrome.tabs.create({ url: 'chrome-extension:/fjjenhlhpcdimhbdbfachdhndiiejgjo/views/break.html' });
                }
                chrome.storage.local.set({ pomodoroState });
            }, 1000);
        }

        if (message.action === "stop-timer") {
            if(pomodoroState === {}){
                return;
            }
            pomodoroState.isRunning = false;
            clearInterval(timerInterval);
        }
    });

    // Blocage des sites
    chrome.webRequest.onBeforeRequest.addListener(
        async (details) => {
            const blockedList = await storage.getItem('local:listWebsite') || []

            const hostname = new URL(details.url).hostname
            console.log(hostname)

            const isBlocked = blockedList.some((item) =>
                hostname.includes(item.website.website_name.toLowerCase())
            )

            if (isBlocked) {
                return {
                    redirectUrl: chrome.runtime.getURL("blocked.html")
                }
            }
        },
        { urls: ["<all_urls>"], types: ["main_frame"] },
        ["blocking"]
    )

});

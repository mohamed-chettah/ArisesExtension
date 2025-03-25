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

        if(message.action === "launch-blocker"){
            console.log('Blocker launched')
            updateBlockingStatus();

        }
    });
    
    /**
     * Crée des règles à partir des sites à bloquer
     */
    function buildRulesFromSites(sites) {
        return sites.listWebsite.map((site, index) => {
            const rawUrl = site.website.website_url;
            const cleanedDomain = rawUrl
                .replace(/^https?:\/\//, '') // retire https:// ou http://
                .replace(/^www\./, '')       // retire www.
                .split('/')[0];              // garde uniquement le domaine

            return {
                id: index + 1000,
                priority: 1,
                action: {
                    type: 'redirect',
                    redirect: { extensionPath: '/views/blocked.html' },
                },
                condition: {
                    urlFilter: `||${cleanedDomain}`,
                    resourceTypes: ['main_frame'],
                },
            };
        });
    }

    /**
     * Met à jour les règles dynamiques selon l'état dans localStorage
     */
    async function updateBlockingStatus() {
        const rawSites =  await chrome.storage.local.get('listWebsite');
        console.log(rawSites)
        const sites = rawSites ? rawSites : [];

        const rules = buildRulesFromSites(sites);

        console.log(rules)

        // Toujours supprimer les anciennes règles dynamiques
        await chrome.declarativeNetRequest.updateDynamicRules({
            removeRuleIds: rules.map((r) => r.id),
            addRules: rules ? rules : [],
        });
    }

});

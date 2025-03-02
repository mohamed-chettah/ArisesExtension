export default defineBackground(() => {
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "twitter_auth_success") {
      chrome.storage.local.set({ twitter_token: message.token });
      console.log("Token reçu et stocké !");
    }
  });
  
})

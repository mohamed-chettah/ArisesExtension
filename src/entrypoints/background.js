export default defineBackground(() => {
//   window.addEventListener("message", (event) => {
//     if (event.source !== window) return // Vérifier que le message vient bien de la page

//     if (event.data.type === "AUTH_SUCCESS") {
//         console.log("Token reçu depuis la page web :", event.data.token)

//         // Envoyer le token à `background.js`
//         chrome.runtime.sendMessage({ type: "AUTH_SUCCESS", token: event.data.token }, (response) => {
//             console.log("Réponse du background script :", response)
//         })
//     }
// })

chrome.action.onClicked.addListener(() => {
  alert('test')
  chrome.windows.create({
    url: "popup/index.html",
    type: "popup",
    width: 600,
    height: 800
  });
});


});

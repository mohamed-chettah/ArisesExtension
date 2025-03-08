document.addEventListener("DOMContentLoaded", function () {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
        chrome.runtime.sendMessage({ type: "SAVE_TOKEN", token: token }, (response) => {
            if (response && response.success) {
                console.log("✅ Token sauvegardé avec succès !");
            } else {
                console.error("❌ Erreur lors de l'enregistrement du token");
            }
        });
    } else {
        console.error("❌ Aucun token trouvé dans l'URL.");
    }
});
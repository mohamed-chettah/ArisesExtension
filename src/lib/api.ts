import axios from 'axios';
import { storage } from "wxt/storage"
// Création d'une instance Axios avec l'URL de base
const api = axios.create({
    baseURL: 'http://localhost:5005/api', // Remplace par ton URL
    headers: { 'Content-Type': 'application/json' }
});

// Ajouter un intercepteur pour gérer l'expiration du token
api.interceptors.response.use(
    response => response, // Si tout va bien, renvoyer la réponse normalement
    error => {
        if (error.response && error.response.status === 401) {
            console.log("Token expiré, déconnexion...");
            storage.removeItem('local:accessToken')
            storage.removeItem('local:user')
            storage.removeItem('local:oauth')
            location.reload()
        }
        else if (error.response && error.response.status === 404) {
            console.log("Accès refusé");
            location.reload()
        }
        return Promise.reject(error);
    }
);

export default api;

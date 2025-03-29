import axios from 'axios';
import { storage } from 'wxt/storage';

// Création d'une instance Axios avec l'URL de base
const api = axios.create({
    baseURL: 'http://localhost:5005/api', // Remplace par ton URL
    headers: { 'Content-Type': 'application/json' }
});

let refreshInterval: ReturnType<typeof setInterval> | null = null;

// ➕ Intercepteur pour gérer le refresh automatique en cas de 401
api.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;

        if (error.response) {
            const status = error.response.status;

            if (status === 403) {
                logout();
            } else if (status === 401 && !originalRequest._retry) {
                originalRequest._retry = true;

                try {
                    const newAccessToken = await refreshToken();

                    if (!newAccessToken) {
                        logout();
                        return Promise.reject(error);
                    }

                    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                    return api.request(originalRequest);

                } catch (err) {
                    logout();
                    return Promise.reject(err);
                }
            }
        }

        return Promise.reject(error);
    }
);

export async function startRefreshWatcher() {
    if (refreshInterval) clearInterval(refreshInterval);

    refreshInterval = setInterval(async () => {
        const expiration: number | null = await storage.getItem('local:expiration');
        if (!expiration) {
            clearInterval(refreshInterval!);
            return;
        }

        const timeLeft = expiration - Date.now();

        if (timeLeft < 60 * 1000) {
            await refreshToken();
        }
    }, 10000);
}

async function refreshToken(): Promise<string | null> {
    try {
        const accessToken = await storage.getItem('local:accessToken');
        if (!accessToken) return null;

        const { data } = await api.post('/refresh', {}, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });

        if (!data || !data.access_token) return null;

        await storage.setItem('local:accessToken', data.access_token);
        await storage.setItem('local:expiration', Date.now() + data.expires_in * 1000); // ✅ Correct ici

        return data.access_token;
    } catch (error) {
        logout();
        return null;
    }
}


// 🚪 Fonction de déconnexion globale
export function logout() {
    console.log('Token expiré, déconnexion...');
    storage.removeItem('local:accessToken');
    storage.removeItem('local:user');
    storage.removeItem('local:isOauth');
    storage.removeItem('local:expiration');
    storage.removeItem('local:listWebsite');
    storage.removeItem('local:pomodoroState');
    storage.removeItem('local:isActiveBlocker');
    storage.setItem('local:isActiveBlocker', false);
    chrome.runtime.sendMessage({ action: 'stop-blocker' });

    // Fermer l'onglet ou rafraîchir (selon besoin de ton extension)
    window.close();
    location.reload();
}

export default api;

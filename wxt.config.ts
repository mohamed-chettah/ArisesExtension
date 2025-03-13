import { defineConfig } from 'wxt';
import { resolve } from 'path';

export default defineConfig({
  extensionApi: 'chrome',
  modules: ['@wxt-dev/module-vue', '@wxt-dev/auto-icons'],
  manifest: {
    name: 'Arises Extension',
    permissions: [
    "identity",
    "identity.email",
    "storage",
    "tabs"
    ],
    "web_accessible_resources": [{
    "resources": ["oauth.html", "oauth.js"],
    "matches": ["*://*/*"]
    }],
    host_permissions: ["*://*/*"], // Autoriser l'extension sur tous les sites
    side_panel: {
      default_path: "views/sidepanel.html", // Fichier HTML affiché
    },
    background: {
      service_worker: "background.js",
    },
    action: {
      default_title: "Ouvrir Arises"
    },
    externally_connectable: {
      matches: ["https://arises.vercel.app//*"] 
    }
  },
  outDir: 'dist',
  srcDir: 'src',
  vite: () => ({
    resolve: {
      alias: {
        '@': resolve(__dirname, './src')
      }
    },
    css: {
      postcss: './postcss.config.cjs'
    },
  }),
});

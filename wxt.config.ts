import { defineConfig } from 'wxt';
import { resolve } from 'path';

export default defineConfig({
  extensionApi: 'chrome',
  modules: ['@wxt-dev/module-vue', '@wxt-dev/auto-icons'],
  manifest: {
    name: 'Arises Extension',
    permissions: ['storage', 'sidePanel'],
    host_permissions: ["*://*/*"], // Autoriser l'extension sur tous les sites
    side_panel: {
      default_path: "sidepanel.html", // Fichier HTML affiché
    },
    background: {
      service_worker: "background.js",
      type: "module"
    },
    action: {
      default_title: "Ouvrir Arises"
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
  })
});

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
    host_permissions: ["*://*/*"],
    background: {
      service_worker: "background.js",
    },
    action: {
      default_title: "Ouvrir Arises"
    },
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

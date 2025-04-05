import { defineConfig } from 'wxt';
import { resolve } from 'path';

export default defineConfig({
  extensionApi: 'chrome',
  modules: ['@wxt-dev/module-vue', '@wxt-dev/auto-icons'],
  manifest: {
    name: 'Arises - Pomodoro timer, Distraction blocker and more',
    version: '1.0.0',
    permissions: [
      "storage",
      "declarativeNetRequest",
      "declarativeNetRequestWithHostAccess"
    ],
    "web_accessible_resources": [{
    "resources": ["oauth.html", "oauth.js", "blocked.html","break.html"],
    "matches": ["<all_urls>"]
    }],
    declarative_net_request : {
      "rule_resources" : [{
        "id": "ruleset_1",
        "enabled": true,
        "path": "scripts/rules_1.json"
      }
      ]
    },
    host_permissions: ["<all_urls>"],
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

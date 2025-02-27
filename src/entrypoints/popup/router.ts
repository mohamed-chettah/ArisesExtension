import { createRouter, createWebHashHistory } from 'vue-router';
import Home from '@/components/Home.vue';
import Settings from '@/components/HelloWorld.vue';


const router = createRouter({
  history: createWebHashHistory(), // Utilisation du hash mode
  routes: [
    { path: '/', component: Settings },
    { path: '/settings', component: Home },
  ],
});

export default router;

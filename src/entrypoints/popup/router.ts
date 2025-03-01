import { createRouter, createWebHashHistory } from 'vue-router';
import Home from '@/components/Home.vue';
import Login from '@/components/Login.vue';


const router = createRouter({
  history: createWebHashHistory(), // Utilisation du hash mode
  routes: [
    { path: '/', component: Login },
    { path: '/settings', component: Home },
  ],
});


export default router;

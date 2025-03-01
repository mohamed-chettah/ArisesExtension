import { createRouter, createWebHashHistory } from 'vue-router';
import Home from '@/components/Home.vue';
import LoginForm from '@/components/LoginForm.vue';


const router = createRouter({
  history: createWebHashHistory(), // Utilisation du hash mode
  routes: [
    { path: '/', component: LoginForm },
    { path: '/settings', component: Home },
  ],
});


export default router;

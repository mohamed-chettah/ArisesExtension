import { createRouter, createWebHashHistory } from 'vue-router';
import LoginForm from '@/components/LoginForm.vue';
import Dashboard from '@/components/Dashboard.vue';
import RegisterForm from '@/components/RegisterForm.vue';


const router = createRouter({
  history: createWebHashHistory(), // Utilisation du hash mode
  routes: [
    { path: '/', component: LoginForm },
    { path: '/register', component: RegisterForm },
    { path: '/dashboard', component: Dashboard},
  ],
});

export default router;

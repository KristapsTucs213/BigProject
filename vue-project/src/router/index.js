import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import Computer_SoftwareView from '../views/Computer_Software.vue';
import Computer_PartsView from '../views/Computer_Parts.vue';
import ComputerView from '../views/Computer.vue';
import PieteikumsView from '../views/Pieteikums.vue';
import LoginView from '../views/Login.vue';
import RegisterView from '../views/Register.vue';
import SoftwareView from '../views/Software.vue';
import PartsView from '../views/Parts.vue';
import RezervacijaView from '../views/Rezervacija.vue';

// Correct path to your store.js (assuming it's in 'src/store.js')
import store from '../store';  // Adjust based on the actual path of store.js
import Rezervacija from '@/views/Rezervacija.vue';




const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/computer',
      name: 'computer',
      component: ComputerView,
    },
    {
      path: '/computer_software',
      name: 'computer_software',
      component: Computer_SoftwareView,
    },
    {
      path: '/computer_parts',
      name: 'computer_parts',
      component: Computer_PartsView,
    },
    {
      path: '/pieteikums',
      name: 'pieteikums',
      component: PieteikumsView,
      meta: { requiresAuth: true },  // Only accessible if logged in
    },
    {
      path: '/software',
      name: 'software',
      component: SoftwareView,
      meta: { requiresAdmin: true },
      
    },
    {
      path: '/parts',
      name: 'parts',
      component: PartsView,
      meta: { requiresAdmin: true },
      
    },
    {
      
      path: '/rezervacija',
      name: 'rezervacija',
      component: RezervacijaView,
      meta: { requiresAdmin: true },
    },

  ],
});

// Global navigation guard to check authentication before entering routes
router.beforeEach((to, from, next) => {
  const isLoggedIn = store.getters.isLoggedIn;
  const isAdmin = store.getters.isAdmin; // Replace with your actual authentication check

  // If the user is logged in and tries to access the login or register page, redirect to home
  if (isLoggedIn && (to.name === 'login' || to.name === 'register')) {
    return next({ name: 'home' }); // Redirect to home or any other route
  }

  // If the route requires authentication and the user is not logged in, redirect to login page
  if (to.meta.requiresAuth && !isLoggedIn) {
    return next({ name: 'login' });
  }

  if (to.meta.requiresAdmin && !isAdmin) {
    return next({ name: 'home' });
  }

  // Otherwise, allow navigation
  next();
});


export default router;
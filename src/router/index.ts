// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import DashboardView from '@/views/DashboardView.vue'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      // This is our protected "dashboard" page
      path: '/dashboard',
      name: 'dashboard',
      // Lazy-load this component
      component: DashboardView,
      meta: { requiresAuth: true }, // Mark this route as protected
    },
    // Redirect root path to login
    {
      path: '/',
      redirect: '/login',
    },
  ],
})

// --- NAVIGATION GUARD ---
// This function runs before every single route change
router.beforeEach((to, from, next) => {
  // We need to initialize the store *outside* the store file
  // to use it here.
  const auth = useAuthStore()

  const isAuthenticated = !!auth.token

  // If the route requires auth and the user is NOT logged in
  if (to.meta.requiresAuth && !isAuthenticated) {
    // Redirect them to the login page
    next({ name: 'login' })
  }
  // If the user is logged in and tries to visit /login
  else if (to.name === 'login' && isAuthenticated) {
    // Redirect them to the dashboard
    next({ name: 'dashboard' })
  }
  // Otherwise, let them go to their destination
  else {
    next()
  }
})

export default router
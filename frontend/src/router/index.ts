import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: () => import('../views/LandingView.vue') },
    { path: '/login', component: () => import('../views/auth/LoginView.vue') },
    { path: '/register', component: () => import('../views/auth/RegisterView.vue') },
    { path: '/verify-email', component: () => import('../views/auth/VerifyView.vue') },
    {
      path: '/dashboard',
      component: () => import('../views/DashboardView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/events',
      component: () => import('../views/events/EventsView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/events/:id',
      component: () => import('../views/events/EventDetailView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/events/create',
      component: () => import('../views/events/CreateEventView.vue'),
      meta: { requiresAuth: true, roles: ['TEACHER', 'ADMIN'] },
    },
    {
      path: '/admin',
      component: () => import('../views/admin/AdminView.vue'),
      meta: { requiresAuth: true, roles: ['ADMIN'] },
    },
    {
      path: '/checkin/:eventId',
      component: () => import('../views/admin/CheckInView.vue'),
      meta: { requiresAuth: true, roles: ['TEACHER', 'ADMIN'] },
    },
  ],
})

router.beforeEach((to) => {
  const auth = useAuthStore()
  if (to.meta.requiresAuth && !auth.isLoggedIn) return '/login'
  if (to.meta.roles && !(to.meta.roles as string[]).includes(auth.user?.role)) return '/dashboard'
})

export default router

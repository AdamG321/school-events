import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: () => import('../views/LandingView.vue') },
    { path: '/login', component: () => import('../views/auth/LoginView.vue') },
    { path: '/register', component: () => import('../views/auth/RegisterView.vue') },
    { path: '/sso-callback', component: () => import('../views/auth/SsoCallbackView.vue') },
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

router.beforeEach(async (to) => {
  if (!to.meta.requiresAuth) return

  // Wait for Clerk to initialise
  const clerk = (window as any).Clerk
  if (clerk) await clerk.load()

  const isSignedIn = !!(window as any).Clerk?.user
  if (!isSignedIn) return '/login'

  // Role guard — only checked after dbUser is loaded
  if (to.meta.roles) {
    const auth = useAuthStore()
    if (auth.dbUser && !(to.meta.roles as string[]).includes(auth.dbUser.role)) {
      return '/dashboard'
    }
  }
})

export default router

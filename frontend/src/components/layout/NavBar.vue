<script setup lang="ts">
import { useAuthStore } from '../../stores/auth'
import { useRouter } from 'vue-router'

const auth = useAuthStore()
const router = useRouter()

function logout() {
  auth.logout()
  router.push('/')
}
</script>

<template>
  <nav class="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.06]"
    style="background: rgba(5,5,16,0.8); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);">
    <div class="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
      <RouterLink to="/"
        class="font-heading font-bold text-xl tracking-tight"
        style="background: linear-gradient(135deg,#6366f1,#8b5cf6,#06b6d4); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;">
        SchoolEvents
      </RouterLink>

      <div class="flex items-center gap-1">
        <RouterLink to="/events"
          class="px-4 py-2 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-all">
          Események
        </RouterLink>
        <RouterLink v-if="auth.isTeacher" to="/events/create"
          class="px-4 py-2 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-all">
          + Új esemény
        </RouterLink>
        <RouterLink v-if="auth.isAdmin" to="/admin"
          class="px-4 py-2 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-all">
          Admin
        </RouterLink>

        <template v-if="auth.isLoggedIn">
          <RouterLink to="/dashboard"
            class="px-4 py-2 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-all ml-2">
            {{ auth.user?.name }}
          </RouterLink>
          <button @click="logout"
            class="ml-1 px-4 py-2 rounded-xl text-sm font-medium text-slate-400 border border-white/10 hover:border-white/20 hover:text-white transition-all">
            Kilépés
          </button>
        </template>
        <template v-else>
          <RouterLink to="/login"
            class="ml-2 px-4 py-2 rounded-xl text-sm font-medium text-slate-300 border border-white/10 hover:border-primary/50 hover:text-white transition-all">
            Bejelentkezés
          </RouterLink>
          <RouterLink to="/register"
            class="ml-1 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all"
            style="background: linear-gradient(135deg,#6366f1,#8b5cf6); box-shadow: 0 0 20px rgba(99,102,241,0.3);">
            Regisztráció
          </RouterLink>
        </template>
      </div>
    </div>
  </nav>
</template>

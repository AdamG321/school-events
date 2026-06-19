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
  <nav class="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur border-b border-gray-100 shadow-sm">
    <div class="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
      <RouterLink to="/" class="font-heading font-bold text-xl text-primary">
        SchoolEvents
      </RouterLink>

      <div class="flex items-center gap-4">
        <RouterLink to="/events" class="text-sm font-medium text-gray-600 hover:text-primary transition-colors">
          Események
        </RouterLink>
        <RouterLink v-if="auth.isTeacher" to="/events/create"
          class="text-sm font-medium text-gray-600 hover:text-primary transition-colors">
          + Új esemény
        </RouterLink>
        <RouterLink v-if="auth.isAdmin" to="/admin"
          class="text-sm font-medium text-gray-600 hover:text-primary transition-colors">
          Admin
        </RouterLink>

        <template v-if="auth.isLoggedIn">
          <RouterLink to="/dashboard"
            class="text-sm font-medium text-gray-600 hover:text-primary transition-colors">
            {{ auth.user?.name }}
          </RouterLink>
          <button @click="logout"
            class="text-sm px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors">
            Kilépés
          </button>
        </template>
        <template v-else>
          <RouterLink to="/login"
            class="text-sm px-4 py-2 rounded-xl border border-primary text-primary hover:bg-primary hover:text-white transition-all">
            Bejelentkezés
          </RouterLink>
          <RouterLink to="/register"
            class="text-sm px-4 py-2 rounded-xl bg-primary text-white hover:bg-primary-dark transition-colors">
            Regisztráció
          </RouterLink>
        </template>
      </div>
    </div>
  </nav>
</template>

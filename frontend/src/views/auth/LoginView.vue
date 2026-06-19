<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '../../stores/auth'
import { useRouter } from 'vue-router'

const auth = useAuthStore()
const router = useRouter()

const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

async function submit() {
  loading.value = true
  error.value = ''
  try {
    await auth.login(email.value, password.value)
    router.push('/dashboard')
  } catch (e: any) {
    error.value = e.response?.data?.message || 'Hibás email vagy jelszó.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-surface flex items-center justify-center px-4">
    <div class="w-full max-w-md">
      <RouterLink to="/" class="flex justify-center mb-8">
        <span class="font-heading font-bold text-2xl text-primary">SchoolEvents</span>
      </RouterLink>

      <div class="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
        <h1 class="font-heading font-bold text-2xl text-deep mb-2">Bejelentkezés</h1>
        <p class="text-gray-500 text-sm mb-6">Üdv vissza!</p>

        <a :href="`${import.meta.env.VITE_API_URL || 'http://localhost:3000/api'}/auth/google`"
          class="flex items-center justify-center gap-3 w-full py-3 px-4 rounded-2xl border border-gray-200 hover:bg-gray-50 transition-all text-sm font-medium text-gray-700 mb-6">
          <img src="https://www.google.com/favicon.ico" class="w-4 h-4" alt="Google" />
          Folytatás Google-lal
        </a>

        <div class="flex items-center gap-3 mb-6">
          <div class="flex-1 h-px bg-gray-200" />
          <span class="text-xs text-gray-400">vagy email-lel</span>
          <div class="flex-1 h-px bg-gray-200" />
        </div>

        <form @submit.prevent="submit" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Email cím</label>
            <input v-model="email" type="email" placeholder="email@iskola.hu" required
              class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-sm transition" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Jelszó</label>
            <input v-model="password" type="password" placeholder="••••••••" required
              class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-sm transition" />
          </div>

          <p v-if="error" class="text-red-500 text-sm">{{ error }}</p>

          <button type="submit" :disabled="loading"
            class="w-full py-3.5 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-primary-dark transition-all disabled:opacity-60 shadow-lg shadow-primary/20">
            {{ loading ? 'Bejelentkezés...' : 'Bejelentkezés' }}
          </button>
        </form>

        <p class="text-center text-sm text-gray-500 mt-6">
          Nincs még fiókod?
          <RouterLink to="/register" class="text-primary font-medium hover:underline">Regisztráció</RouterLink>
        </p>
      </div>
    </div>
  </div>
</template>

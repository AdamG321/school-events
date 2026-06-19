<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '../../stores/auth'
import { useRouter, useRoute } from 'vue-router'

const auth = useAuthStore()
const router = useRouter()
const route = useRoute()

const code = ref('')
const error = ref('')
const loading = ref(false)
const email = route.query.email as string

async function submit() {
  if (code.value.length !== 6) return
  loading.value = true
  error.value = ''
  try {
    await auth.verifyEmail(code.value)
    router.push('/dashboard')
  } catch (e: any) {
    error.value = e.response?.data?.message || 'Érvénytelen vagy lejárt kód.'
    code.value = ''
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-surface flex items-center justify-center px-4">
    <div class="w-full max-w-md text-center">
      <RouterLink to="/" class="flex justify-center mb-8">
        <span class="font-heading font-bold text-2xl text-primary">SchoolEvents</span>
      </RouterLink>

      <div class="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
        <div class="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <span class="text-3xl">📧</span>
        </div>
        <h1 class="font-heading font-bold text-2xl text-deep mb-2">Email megerősítés</h1>
        <p class="text-gray-500 text-sm mb-2">
          Elküldtük a 6 jegyű kódot erre a címre:
        </p>
        <p class="text-primary font-semibold text-sm mb-8">{{ email }}</p>

        <form @submit.prevent="submit" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2 text-left">Írd be a kódot</label>
            <input
              v-model="code"
              type="text"
              maxlength="6"
              placeholder="123456"
              required
              class="w-full px-4 py-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-2xl text-center font-mono tracking-[0.5em] transition"
            />
          </div>

          <p v-if="error" class="text-red-500 text-sm">{{ error }}</p>

          <button type="submit" :disabled="loading || code.length !== 6"
            class="w-full py-3.5 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-primary-dark transition-all disabled:opacity-60 shadow-lg shadow-primary/20">
            {{ loading ? 'Ellenőrzés...' : 'Megerősítés' }}
          </button>
        </form>

        <p class="text-center text-sm text-gray-400 mt-6">
          Nem kaptad meg?
          <button class="text-primary font-medium hover:underline ml-1">Újraküldés</button>
        </p>
      </div>
    </div>
  </div>
</template>

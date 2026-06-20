<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '../../stores/auth'
import { useRouter, useRoute } from 'vue-router'
import SpotlightCard from '../../components/ui/SpotlightCard.vue'

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
  <div class="min-h-screen flex items-center justify-center px-4" style="background:#050510;">
    <div class="absolute inset-0 pointer-events-none overflow-hidden">
      <div class="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full opacity-20"
        style="background:radial-gradient(circle,#06b6d4,transparent 70%); filter:blur(80px);" />
    </div>

    <div class="relative w-full max-w-md z-10 text-center">
      <RouterLink to="/" class="flex justify-center mb-8">
        <span class="font-heading font-bold text-2xl gradient-text">SchoolEvents</span>
      </RouterLink>

      <SpotlightCard spotlight-color="rgba(6,182,212,0.08)" class="rounded-3xl p-8"
        style="background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.08); backdrop-filter:blur(24px);">

        <div class="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
          style="background:rgba(6,182,212,0.1); border:1px solid rgba(6,182,212,0.2);">
          <svg class="w-8 h-8 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
          </svg>
        </div>

        <h1 class="font-heading font-bold text-2xl text-white mb-2">Email megerősítés</h1>
        <p class="text-slate-400 text-sm mb-1">Elküldtük a 6 jegyű kódot erre a címre:</p>
        <p class="text-indigo-400 font-semibold text-sm mb-8">{{ email }}</p>

        <form @submit.prevent="submit" class="space-y-4 text-left">
          <div>
            <label class="block text-sm font-medium text-slate-300 mb-2">Írd be a kódot</label>
            <input v-model="code" type="text" maxlength="6" placeholder="123456" required
              class="w-full px-4 py-4 rounded-xl text-white placeholder-slate-600 outline-none transition-all text-center font-mono tracking-[0.5em] text-2xl"
              style="background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1);"
              @focus="($event.target as HTMLInputElement).style.borderColor='rgba(6,182,212,0.5)'"
              @blur="($event.target as HTMLInputElement).style.borderColor='rgba(255,255,255,0.1)'" />
          </div>

          <div v-if="error"
            class="flex items-center gap-2 rounded-xl px-4 py-3 text-sm text-red-300"
            style="background:rgba(239,68,68,0.08); border:1px solid rgba(239,68,68,0.2);">
            <svg class="w-4 h-4 shrink-0 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            {{ error }}
          </div>

          <button type="submit" :disabled="loading || code.length !== 6"
            class="w-full py-3.5 rounded-xl font-semibold text-white text-sm transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-40"
            style="background:linear-gradient(135deg,#06b6d4,#6366f1); box-shadow:0 0 25px rgba(6,182,212,0.25);">
            {{ loading ? 'Ellenőrzés...' : 'Megerősítés' }}
          </button>
        </form>

        <p class="text-center text-sm text-slate-500 mt-6">
          Nem kaptad meg?
          <button class="text-indigo-400 font-medium hover:text-indigo-300 transition-colors ml-1">Újraküldés</button>
        </p>
      </SpotlightCard>
    </div>
  </div>
</template>

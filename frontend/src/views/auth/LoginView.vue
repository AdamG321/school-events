<script setup lang="ts">
import { ref } from 'vue'
import { useSignIn } from '@clerk/vue'
import { useRouter } from 'vue-router'
import SpotlightCard from '../../components/ui/SpotlightCard.vue'
import DarkVeil from '../../components/bg/DarkVeil.vue'
import { useAuthStore } from '../../stores/auth'

const { signIn, isLoaded } = useSignIn()
const auth = useAuthStore()
const router = useRouter()

const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

async function submit() {
  if (!isLoaded.value) return
  loading.value = true
  error.value = ''
  try {
    const result = await signIn.value!.create({
      identifier: email.value,
      password: password.value,
    })
    if (result.status === 'complete') {
      await auth.fetchMe()
      router.push('/dashboard')
    }
  } catch (e: any) {
    error.value = e.errors?.[0]?.longMessage || e.errors?.[0]?.message || 'Hibás email vagy jelszó.'
  } finally {
    loading.value = false
  }
}

function loginWithGoogle() {
  signIn.value?.authenticateWithRedirect({
    strategy: 'oauth_google',
    redirectUrl: '/sso-callback',
    redirectUrlComplete: '/dashboard',
  })
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center px-4" style="background:#050510;">
    <!-- DarkVeil animated background -->
    <div class="fixed inset-0 pointer-events-none">
      <DarkVeil :speed="0.4" :warp-amount="0.15" :noise-intensity="0.03" />
    </div>

    <div class="relative w-full max-w-md z-10">
      <RouterLink to="/" class="flex justify-center mb-8">
        <span class="font-heading font-bold text-2xl gradient-text">SchoolEvents</span>
      </RouterLink>

      <SpotlightCard
        spotlight-color="rgba(99,102,241,0.15)"
        class="rounded-3xl p-8"
        style="background:rgba(13,13,32,0.85); border:1px solid rgba(99,102,241,0.25); backdrop-filter:blur(24px); box-shadow:0 0 60px rgba(99,102,241,0.12), inset 0 1px 0 rgba(255,255,255,0.06);">

        <h1 class="font-heading font-bold text-2xl text-white mb-1">Bejelentkezés</h1>
        <p class="text-slate-400 text-sm mb-7">Üdv vissza!</p>

        <!-- Google OAuth -->
        <button @click="loginWithGoogle"
          class="flex items-center justify-center gap-3 w-full py-3 px-4 rounded-2xl text-sm font-medium text-slate-300 transition-all hover:text-white hover:border-white/20 mb-6"
          style="background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1);">
          <svg class="w-4 h-4" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Folytatás Google-lal
        </button>

        <div class="flex items-center gap-3 mb-6">
          <div class="flex-1 h-px" style="background:rgba(255,255,255,0.08);" />
          <span class="text-xs text-slate-500">vagy email-lel</span>
          <div class="flex-1 h-px" style="background:rgba(255,255,255,0.08);" />
        </div>

        <form @submit.prevent="submit" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-slate-300 mb-1.5">Email cím</label>
            <input v-model="email" type="email" placeholder="email@iskola.hu" required
              class="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-slate-500 outline-none transition-all"
              style="background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1);"
              @focus="($event.target as HTMLInputElement).style.borderColor='rgba(99,102,241,0.6)'"
              @blur="($event.target as HTMLInputElement).style.borderColor='rgba(255,255,255,0.1)'" />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-300 mb-1.5">Jelszó</label>
            <input v-model="password" type="password" placeholder="••••••••" required
              class="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-slate-500 outline-none transition-all"
              style="background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1);"
              @focus="($event.target as HTMLInputElement).style.borderColor='rgba(99,102,241,0.6)'"
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

          <button type="submit" :disabled="loading || !isLoaded"
            class="w-full py-3.5 rounded-xl font-semibold text-white text-sm transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-50 mt-2"
            style="background:linear-gradient(135deg,#6366f1,#8b5cf6); box-shadow:0 0 25px rgba(99,102,241,0.3);">
            {{ loading ? 'Bejelentkezés...' : 'Bejelentkezés' }}
          </button>
        </form>

        <p class="text-center text-sm text-slate-500 mt-6">
          Nincs még fiókod?
          <RouterLink to="/register" class="text-indigo-400 font-medium hover:text-indigo-300 transition-colors">
            Regisztráció
          </RouterLink>
        </p>
      </SpotlightCard>
    </div>
  </div>
</template>

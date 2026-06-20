<script setup lang="ts">
import { onMounted } from 'vue'
import { AuthenticateWithRedirectCallback } from '@clerk/vue'
import { useAuthStore } from '../../stores/auth'
import { useRouter } from 'vue-router'

const auth = useAuthStore()
const router = useRouter()

// After Clerk processes the OAuth callback, sync user and redirect
async function handleRedirect() {
  await auth.syncUser('STUDENT')
  router.push('/dashboard')
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center" style="background:#050510;">
    <AuthenticateWithRedirectCallback @transfer-complete="handleRedirect" />
    <div class="text-slate-400 text-sm">Bejelentkezés folyamatban...</div>
  </div>
</template>

<script setup lang="ts">
import { watch } from 'vue'
import { useAuth } from '@clerk/vue'
import { useAuthStore } from './stores/auth'
import NavBar from './components/layout/NavBar.vue'
import { useRoute } from 'vue-router'

const { isSignedIn } = useAuth()
const auth = useAuthStore()
const route = useRoute()

// Sync DB user whenever Clerk auth state changes
watch(isSignedIn, (val) => {
  if (val) auth.fetchMe()
  else auth.dbUser = null
}, { immediate: true })

const hideNav = ['/'].includes(route.path)
</script>

<template>
  <NavBar v-if="!hideNav" />
  <RouterView />
</template>

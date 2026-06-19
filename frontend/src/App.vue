<script setup lang="ts">
import { onMounted } from 'vue'
import { useAuthStore } from './stores/auth'
import NavBar from './components/layout/NavBar.vue'
import { useRoute } from 'vue-router'

const auth = useAuthStore()
const route = useRoute()

onMounted(() => auth.fetchMe())

const hideNav = ['/'].includes(route.path)
</script>

<template>
  <NavBar v-if="!hideNav" />
  <RouterView />
</template>

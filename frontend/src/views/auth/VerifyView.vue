<script setup lang="ts">
// Verification is now handled inline in RegisterView (Clerk email_code flow)
import { useRouter } from 'vue-router'
const router = useRouter()
router.replace('/register')
</script>

<template><div /></template>

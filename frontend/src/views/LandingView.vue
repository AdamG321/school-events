<script setup lang="ts">
import HeroScene from '../components/three/HeroScene.vue'
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <div class="relative min-h-screen bg-deep overflow-hidden">
    <!-- Three.js canvas háttér -->
    <HeroScene />

    <!-- Gradient overlay -->
    <div class="absolute inset-0 bg-gradient-to-b from-deep/60 via-transparent to-deep/90 pointer-events-none" />

    <!-- Nav -->
    <nav class="relative z-10 flex items-center justify-between px-8 py-6">
      <span class="font-heading font-bold text-2xl text-white tracking-tight">SchoolEvents</span>
      <div class="flex gap-3">
        <RouterLink to="/login"
          class="px-5 py-2.5 rounded-2xl border border-white/30 text-white text-sm font-medium hover:bg-white/10 transition-all">
          Bejelentkezés
        </RouterLink>
        <RouterLink to="/register"
          class="px-5 py-2.5 rounded-2xl bg-primary text-white text-sm font-semibold hover:bg-primary-dark transition-all shadow-lg shadow-primary/30">
          Regisztráció
        </RouterLink>
      </div>
    </nav>

    <!-- Hero content -->
    <div class="relative z-10 flex flex-col items-center justify-center min-h-[80vh] text-center px-6">
      <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 border border-primary/40 text-primary-light text-sm font-medium mb-8 backdrop-blur">
        <span class="w-2 h-2 rounded-full bg-secondary animate-pulse" />
        Iskolai eseménykezelő rendszer
      </div>

      <h1 class="font-heading font-extrabold text-5xl md:text-7xl text-white leading-tight mb-6 max-w-4xl">
        Minden iskolai esemény
        <span class="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
          egy helyen
        </span>
      </h1>

      <p class="text-gray-300 text-lg md:text-xl max-w-2xl mb-10 leading-relaxed">
        Hozz létre, kezeld és kövesd nyomon az iskolai eseményeket. Diákoknak, tanároknak és adminisztrátoroknak egyaránt.
      </p>

      <div class="flex flex-col sm:flex-row gap-4">
        <button @click="router.push('/register')"
          class="px-8 py-4 rounded-2xl bg-primary text-white font-semibold text-lg hover:bg-primary-dark transition-all shadow-xl shadow-primary/40 hover:scale-105 active:scale-100">
          Kezdés — ingyenes
        </button>
        <button @click="router.push('/events')"
          class="px-8 py-4 rounded-2xl bg-white/10 border border-white/20 text-white font-semibold text-lg hover:bg-white/20 transition-all backdrop-blur">
          Események böngészése
        </button>
      </div>
    </div>

    <!-- Feature cards -->
    <div class="relative z-10 max-w-5xl mx-auto px-6 pb-20 grid grid-cols-1 md:grid-cols-3 gap-6">
      <div v-for="f in features" :key="f.title"
        class="bg-white/5 backdrop-blur border border-white/10 rounded-3xl p-6 hover:bg-white/10 transition-all">
        <div class="text-3xl mb-3">{{ f.icon }}</div>
        <h3 class="font-heading font-semibold text-white text-lg mb-2">{{ f.title }}</h3>
        <p class="text-gray-400 text-sm leading-relaxed">{{ f.desc }}</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
const features = [
  { icon: '📅', title: 'Naptár nézet', desc: 'Havi, heti és napi nézetben böngészheted az eseményeket.' },
  { icon: '🎫', title: 'Egyszerű jelentkezés', desc: 'Egy kattintással jelentkezz, várólistás rendszerrel.' },
  { icon: '📊', title: 'Admin dashboard', desc: 'Jóváhagyás, QR check-in és részletes analitika.' },
]
</script>

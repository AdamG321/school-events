<script setup lang="ts">
import HeroScene from '../components/three/HeroScene.vue'
import SpotlightCard from '../components/ui/SpotlightCard.vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const features = [
  {
    icon: '◈',
    title: 'Naptár nézet',
    desc: 'Havi, heti és napi nézetben böngészheted az eseményeket. FullCalendar integráció.',
    color: '#6366f1',
  },
  {
    icon: '⬡',
    title: 'Egyszerű jelentkezés',
    desc: 'Egy kattintással jelentkezz. Automatikus visszaigazoló email és várólistás rendszer.',
    color: '#8b5cf6',
  },
  {
    icon: '◉',
    title: 'Admin & QR check-in',
    desc: 'Valós idejű jóváhagyási workflow, QR kód alapú beléptetés és részletes analitika.',
    color: '#06b6d4',
  },
]
</script>

<template>
  <div class="relative min-h-screen overflow-hidden" style="background:#050510;">
    <!-- Three.js animated bg -->
    <HeroScene />

    <!-- Radial glow overlays -->
    <div class="absolute inset-0 pointer-events-none">
      <div class="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-20"
        style="background:radial-gradient(circle,#6366f1,transparent 70%); filter:blur(60px);" />
      <div class="absolute top-1/3 right-1/4 w-80 h-80 rounded-full opacity-15"
        style="background:radial-gradient(circle,#8b5cf6,transparent 70%); filter:blur(60px);" />
      <div class="absolute bottom-1/4 left-1/2 w-72 h-72 rounded-full opacity-10"
        style="background:radial-gradient(circle,#06b6d4,transparent 70%); filter:blur(80px);" />
    </div>

    <!-- Nav -->
    <nav class="relative z-10 flex items-center justify-between px-8 py-6">
      <span class="font-heading font-bold text-2xl tracking-tight shine-text">SchoolEvents</span>
      <div class="flex gap-3">
        <RouterLink to="/login"
          class="px-5 py-2.5 rounded-2xl text-sm font-medium text-slate-300 border border-white/10 hover:border-white/20 hover:text-white transition-all"
          style="background:rgba(255,255,255,0.03); backdrop-filter:blur(10px);">
          Bejelentkezés
        </RouterLink>
        <RouterLink to="/register"
          class="px-5 py-2.5 rounded-2xl text-sm font-semibold text-white transition-all hover:scale-105 active:scale-100"
          style="background:linear-gradient(135deg,#6366f1,#8b5cf6); box-shadow:0 0 25px rgba(99,102,241,0.4);">
          Regisztráció
        </RouterLink>
      </div>
    </nav>

    <!-- Hero -->
    <div class="relative z-10 flex flex-col items-center justify-center min-h-[78vh] text-center px-6">
      <!-- Badge -->
      <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 text-sm font-medium text-indigo-300"
        style="background:rgba(99,102,241,0.12); border:1px solid rgba(99,102,241,0.3); backdrop-filter:blur(10px);">
        <span class="w-2 h-2 rounded-full bg-indigo-400 animate-pulse-slow" />
        Iskolai eseménykezelő rendszer
      </div>

      <!-- Heading -->
      <h1 class="font-heading font-extrabold leading-tight mb-6 max-w-4xl"
        style="font-size:clamp(2.5rem,6vw,4.5rem);">
        <span class="text-white">Minden iskolai esemény</span><br />
        <span class="gradient-text">egy helyen.</span>
      </h1>

      <p class="text-slate-400 text-lg md:text-xl max-w-2xl mb-10 leading-relaxed">
        Hozz létre, kezeld és kövesd nyomon az iskolai eseményeket.<br class="hidden md:block" />
        Diákoknak, tanároknak és adminisztrátoroknak egyaránt.
      </p>

      <!-- CTA buttons -->
      <div class="flex flex-col sm:flex-row gap-4">
        <button @click="router.push('/register')"
          class="px-8 py-4 rounded-2xl font-semibold text-white text-lg transition-all hover:scale-105 active:scale-100"
          style="background:linear-gradient(135deg,#6366f1,#8b5cf6); box-shadow:0 0 40px rgba(99,102,241,0.35);">
          Kezdés — ingyenes
        </button>
        <button @click="router.push('/login')"
          class="px-8 py-4 rounded-2xl font-semibold text-slate-300 text-lg transition-all hover:text-white"
          style="background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1); backdrop-filter:blur(10px);">
          Bejelentkezés →
        </button>
      </div>

      <!-- Scroll hint -->
      <div class="mt-16 flex flex-col items-center gap-2 opacity-40">
        <div class="w-px h-8 bg-gradient-to-b from-transparent to-slate-400" />
        <span class="text-xs text-slate-500 tracking-widest uppercase">Fedezd fel</span>
      </div>
    </div>

    <!-- Feature cards -->
    <div class="relative z-10 max-w-5xl mx-auto px-6 pb-24 grid grid-cols-1 md:grid-cols-3 gap-5">
      <SpotlightCard
        v-for="f in features" :key="f.title"
        :spotlight-color="`${f.color}20`"
        class="rounded-3xl p-6 transition-all duration-300 hover:-translate-y-1 cursor-default"
        style="background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.07); backdrop-filter:blur(20px);">
        <div class="relative z-10">
          <div class="text-2xl mb-4 font-mono" :style="`color:${f.color}`">{{ f.icon }}</div>
          <h3 class="font-heading font-semibold text-white text-lg mb-2">{{ f.title }}</h3>
          <p class="text-slate-400 text-sm leading-relaxed">{{ f.desc }}</p>
        </div>
      </SpotlightCard>
    </div>
  </div>
</template>

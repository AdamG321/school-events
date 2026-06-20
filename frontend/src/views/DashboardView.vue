<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useEventsStore } from '../stores/events'
import SpotlightCard from '../components/ui/SpotlightCard.vue'
import CountUp from '../components/ui/CountUp.vue'

const auth = useAuthStore()
const events = useEventsStore()

onMounted(() => events.fetchAll())

const upcoming = computed(() =>
  events.events
    .filter((e) => new Date(e.startAt) > new Date() && e.status === 'ACTIVE')
    .slice(0, 6)
)


function formatDate(d: string) {
  return new Date(d).toLocaleDateString('hu-HU', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

const roleLabel = computed(() => {
  const r = auth.user?.role
  return r === 'STUDENT' ? 'Diák' : r === 'TEACHER' ? 'Tanár' : 'Adminisztrátor'
})

const statCards = [
  { label: 'Összes esemény', displayValue: '—', dynamic: false, glow: 'rgba(99,102,241,0.08)', value: 0 },
  { label: 'Jelentkezéseim', displayValue: '—', dynamic: false, glow: 'rgba(139,92,246,0.08)', value: 0 },
  { label: 'Közelgő', displayValue: '—', dynamic: false, glow: 'rgba(6,182,212,0.08)', value: 0 },
  { label: 'Teljesített', displayValue: '—', dynamic: false, glow: 'rgba(245,158,11,0.08)', value: 0 },
]
</script>

<template>
  <div class="pt-16 min-h-screen" style="background:#050510;">
    <!-- Subtle glow top -->
    <div class="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] pointer-events-none opacity-10"
      style="background:radial-gradient(ellipse,#6366f1,transparent 70%); filter:blur(60px);" />

    <div class="max-w-6xl mx-auto px-6 py-10 relative z-10">

      <!-- Header -->
      <div class="mb-10">
        <p class="text-slate-500 text-sm font-medium mb-1 uppercase tracking-widest">{{ roleLabel }}</p>
        <h1 class="font-heading font-bold text-3xl text-white">
          Üdvözöllek, <span class="gradient-text">{{ auth.user?.name?.split(' ')[0] }}</span>!
        </h1>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <SpotlightCard v-for="s in statCards" :key="s.label"
          :spotlight-color="s.glow"
          class="rounded-2xl p-5 transition-all hover:-translate-y-0.5"
          style="background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.07);">
          <div class="relative z-10">
            <p class="font-heading font-bold text-2xl text-white mb-1">
              <CountUp v-if="s.dynamic" :to="s.value" :duration="1200" />
              <span v-else>{{ s.displayValue }}</span>
            </p>
            <p class="text-xs text-slate-500">{{ s.label }}</p>
          </div>
        </SpotlightCard>
      </div>

      <!-- Section title -->
      <div class="flex items-center justify-between mb-6">
        <h2 class="font-heading font-semibold text-xl text-white">Közelgő események</h2>
        <RouterLink to="/events"
          class="text-sm text-indigo-400 hover:text-indigo-300 transition-colors font-medium">
          Összes →
        </RouterLink>
      </div>

      <!-- Loading -->
      <div v-if="events.loading" class="flex justify-center py-16">
        <div class="w-8 h-8 rounded-full border-2 border-transparent animate-spin"
          style="border-top-color:#6366f1; border-right-color:#8b5cf6;" />
      </div>

      <!-- Empty -->
      <div v-else-if="upcoming.length === 0"
        class="text-center py-16 rounded-3xl"
        style="background:rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.06);">
        <div class="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4"
          style="background:rgba(99,102,241,0.1); border:1px solid rgba(99,102,241,0.2);">
          <svg class="w-6 h-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
          </svg>
        </div>
        <p class="text-slate-400 text-sm">Nincs közelgő esemény.</p>
        <RouterLink to="/events" class="text-indigo-400 text-sm font-medium mt-2 inline-block hover:text-indigo-300 transition-colors">
          Összes esemény megtekintése
        </RouterLink>
      </div>

      <!-- Event grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <RouterLink v-for="event in upcoming" :key="event.id" :to="`/events/${event.id}`"
          class="group rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 block"
          style="background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.07);">
          <!-- Cover -->
          <div v-if="event.coverImageUrl" class="h-36 overflow-hidden">
            <img :src="event.coverImageUrl" :alt="event.title"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          </div>
          <div v-else class="h-36 flex items-center justify-center"
            style="background:linear-gradient(135deg,rgba(99,102,241,0.15),rgba(139,92,246,0.15));">
            <svg class="w-10 h-10 text-indigo-400 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
          </div>
          <!-- Info -->
          <div class="p-4">
            <span class="text-xs font-medium text-indigo-400 px-2 py-0.5 rounded-full"
              style="background:rgba(99,102,241,0.12);">{{ event.category }}</span>
            <h3 class="font-heading font-semibold text-white mt-2 mb-1 line-clamp-2 text-sm">{{ event.title }}</h3>
            <p class="text-xs text-slate-500">{{ formatDate(event.startAt) }}</p>
            <p class="text-xs text-slate-600 mt-0.5">{{ event.location }}</p>
          </div>
        </RouterLink>
      </div>
    </div>
  </div>
</template>

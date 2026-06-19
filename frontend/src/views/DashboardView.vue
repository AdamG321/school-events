<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useEventsStore } from '../stores/events'

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
</script>

<template>
  <div class="pt-16 min-h-screen bg-surface">
    <div class="max-w-6xl mx-auto px-6 py-10">

      <!-- Header -->
      <div class="mb-8">
        <h1 class="font-heading font-bold text-3xl text-deep mb-1">
          Üdvözöllek, {{ auth.user?.name?.split(' ')[0] }}!
        </h1>
        <p class="text-gray-500">{{ auth.user?.role === 'STUDENT' ? 'Diák' : auth.user?.role === 'TEACHER' ? 'Tanár' : 'Adminisztrátor' }} — Közelgő eseményeid</p>
      </div>

      <!-- Quick stats -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <div v-for="s in stats" :key="s.label"
          class="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <p class="text-2xl font-heading font-bold text-deep">{{ s.value }}</p>
          <p class="text-xs text-gray-500 mt-1">{{ s.label }}</p>
        </div>
      </div>

      <!-- Upcoming events -->
      <h2 class="font-heading font-semibold text-xl text-deep mb-4">Közelgő események</h2>

      <div v-if="events.loading" class="flex justify-center py-12">
        <div class="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>

      <div v-else-if="upcoming.length === 0" class="text-center py-16 text-gray-400">
        <p class="text-4xl mb-3">📅</p>
        <p>Nincs közelgő esemény.</p>
        <RouterLink to="/events" class="text-primary text-sm font-medium mt-2 inline-block hover:underline">
          Összes esemény megtekintése
        </RouterLink>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <RouterLink v-for="event in upcoming" :key="event.id" :to="`/events/${event.id}`"
          class="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all overflow-hidden group">
          <div v-if="event.coverImageUrl" class="h-36 overflow-hidden">
            <img :src="event.coverImageUrl" :alt="event.title" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
          </div>
          <div v-else class="h-36 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-4xl">
            📅
          </div>
          <div class="p-4">
            <span class="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">{{ event.category }}</span>
            <h3 class="font-heading font-semibold text-deep mt-2 mb-1 line-clamp-2">{{ event.title }}</h3>
            <p class="text-xs text-gray-500">{{ formatDate(event.startAt) }}</p>
            <p class="text-xs text-gray-400 mt-1">{{ event.location }}</p>
          </div>
        </RouterLink>
      </div>

      <div class="mt-6 text-center">
        <RouterLink to="/events"
          class="inline-flex items-center gap-2 text-primary font-medium text-sm hover:underline">
          Összes esemény megtekintése →
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
const stats = [
  { label: 'Összes esemény', value: '—' },
  { label: 'Jelentkezéseim', value: '—' },
  { label: 'Közelgő', value: '—' },
  { label: 'Teljesített', value: '—' },
]
</script>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useEventsStore } from '../../stores/events'
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'

const store = useEventsStore()
const view = ref<'grid' | 'calendar'>('grid')
const search = ref('')
const category = ref('')

onMounted(() => store.fetchAll())

const categories = ['Sport', 'Kulturális', 'Akadémiai', 'Kirándulás', 'Egyéb']

const filtered = computed(() =>
  store.events.filter((e) => {
    const matchSearch = e.title.toLowerCase().includes(search.value.toLowerCase())
    const matchCat = !category.value || e.category === category.value
    return matchSearch && matchCat && e.status === 'ACTIVE'
  })
)

const calendarOptions = computed(() => ({
  plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
  initialView: 'dayGridMonth',
  locale: 'hu',
  headerToolbar: { left: 'prev,next today', center: 'title', right: 'dayGridMonth,timeGridWeek' },
  events: store.events.map((e) => ({
    id: e.id,
    title: e.title,
    start: e.startAt,
    end: e.endAt,
    color: '#6366F1',
  })),
}))

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('hu-HU', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}
</script>

<template>
  <div class="pt-16 min-h-screen bg-surface">
    <div class="max-w-6xl mx-auto px-6 py-10">

      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <h1 class="font-heading font-bold text-3xl text-deep">Események</h1>
        <div class="flex gap-2">
          <button @click="view = 'grid'" :class="['px-4 py-2 rounded-xl text-sm font-medium transition-all', view === 'grid' ? 'bg-primary text-white' : 'bg-white border border-gray-200 text-gray-600']">
            Lista
          </button>
          <button @click="view = 'calendar'" :class="['px-4 py-2 rounded-xl text-sm font-medium transition-all', view === 'calendar' ? 'bg-primary text-white' : 'bg-white border border-gray-200 text-gray-600']">
            Naptár
          </button>
        </div>
      </div>

      <!-- Filters -->
      <div class="flex gap-3 mb-8 flex-wrap">
        <input v-model="search" placeholder="Keresés..." type="text"
          class="px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary w-64 transition" />
        <select v-model="category"
          class="px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary/30 transition">
          <option value="">Minden kategória</option>
          <option v-for="c in categories" :key="c" :value="c">{{ c }}</option>
        </select>
      </div>

      <!-- Grid view -->
      <div v-if="view === 'grid'">
        <div v-if="store.loading" class="flex justify-center py-16">
          <div class="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        </div>
        <div v-else-if="filtered.length === 0" class="text-center py-16 text-gray-400">
          <p class="text-4xl mb-3">🔍</p>
          <p>Nincs találat.</p>
        </div>
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <RouterLink v-for="event in filtered" :key="event.id" :to="`/events/${event.id}`"
            class="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all overflow-hidden group">
            <div v-if="event.coverImageUrl" class="h-40 overflow-hidden">
              <img :src="event.coverImageUrl" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
            </div>
            <div v-else class="h-40 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-5xl">
              📅
            </div>
            <div class="p-5">
              <div class="flex items-center justify-between mb-2">
                <span class="text-xs font-medium text-primary bg-primary/10 px-2.5 py-1 rounded-full">{{ event.category }}</span>
                <span v-if="event.capacity" class="text-xs text-gray-400">
                  {{ event._count?.registrations || 0 }}/{{ event.capacity }}
                </span>
              </div>
              <h3 class="font-heading font-semibold text-deep text-lg mb-2 line-clamp-2">{{ event.title }}</h3>
              <p class="text-sm text-gray-500 mb-3 line-clamp-2">{{ event.description }}</p>
              <div class="flex items-center gap-1 text-xs text-gray-400">
                <span>📍</span><span>{{ event.location }}</span>
              </div>
              <div class="flex items-center gap-1 text-xs text-gray-400 mt-1">
                <span>🕐</span><span>{{ formatDate(event.startAt) }}</span>
              </div>
            </div>
          </RouterLink>
        </div>
      </div>

      <!-- Calendar view -->
      <div v-else class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <FullCalendar :options="calendarOptions" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useEventsStore } from '../../stores/events'
import SpotlightCard from '../../components/ui/SpotlightCard.vue'
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
  <div class="pt-16 min-h-screen" style="background:#050510;">
    <div class="fixed top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] pointer-events-none opacity-10"
      style="background:radial-gradient(ellipse,#6366f1,transparent 70%); filter:blur(60px);" />

    <div class="max-w-6xl mx-auto px-6 py-10 relative z-10">

      <!-- Header -->
      <div class="flex items-center justify-between mb-8">
        <h1 class="font-heading font-bold text-3xl text-white">Események</h1>
        <div class="flex gap-2">
          <button @click="view = 'grid'"
            class="px-4 py-2 rounded-xl text-sm font-medium transition-all"
            :style="view === 'grid'
              ? 'background:linear-gradient(135deg,#6366f1,#8b5cf6); color:#fff;'
              : 'background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1); color:#94a3b8;'">
            Lista
          </button>
          <button @click="view = 'calendar'"
            class="px-4 py-2 rounded-xl text-sm font-medium transition-all"
            :style="view === 'calendar'
              ? 'background:linear-gradient(135deg,#6366f1,#8b5cf6); color:#fff;'
              : 'background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1); color:#94a3b8;'">
            Naptár
          </button>
        </div>
      </div>

      <!-- Filters -->
      <div class="flex gap-3 mb-8 flex-wrap">
        <input v-model="search" placeholder="Keresés..." type="text"
          class="px-4 py-2.5 rounded-xl text-sm text-white placeholder-slate-500 outline-none transition-all w-64"
          style="background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1);"
          @focus="($event.target as HTMLInputElement).style.borderColor='rgba(99,102,241,0.5)'"
          @blur="($event.target as HTMLInputElement).style.borderColor='rgba(255,255,255,0.1)'" />
        <select v-model="category"
          class="px-4 py-2.5 rounded-xl text-sm outline-none transition-all"
          style="background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1); color:#94a3b8;">
          <option value="" style="background:#0d0d20;">Minden kategória</option>
          <option v-for="c in categories" :key="c" :value="c" style="background:#0d0d20;">{{ c }}</option>
        </select>
      </div>

      <!-- Grid view -->
      <div v-if="view === 'grid'">
        <div v-if="store.loading" class="flex justify-center py-16">
          <div class="w-8 h-8 rounded-full border-2 border-transparent animate-spin"
            style="border-top-color:#6366f1; border-right-color:#8b5cf6;" />
        </div>

        <div v-else-if="filtered.length === 0"
          class="text-center py-16 rounded-3xl"
          style="background:rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.06);">
          <div class="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style="background:rgba(99,102,241,0.1); border:1px solid rgba(99,102,241,0.2);">
            <svg class="w-6 h-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
          </div>
          <p class="text-slate-400 text-sm">Nincs találat.</p>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <SpotlightCard v-for="event in filtered" :key="event.id"
            spotlight-color="rgba(99,102,241,0.08)"
            class="rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1"
            style="background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.07);">
            <RouterLink :to="`/events/${event.id}`" class="block relative z-10 group">
              <div v-if="event.coverImageUrl" class="h-40 overflow-hidden">
                <img :src="event.coverImageUrl" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div v-else class="h-40 flex items-center justify-center"
                style="background:linear-gradient(135deg,rgba(99,102,241,0.15),rgba(139,92,246,0.1));">
                <svg class="w-10 h-10 text-indigo-400 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
              </div>
              <div class="p-5">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-xs font-medium text-indigo-400 px-2.5 py-1 rounded-full"
                    style="background:rgba(99,102,241,0.12);">{{ event.category }}</span>
                  <span v-if="event.capacity" class="text-xs text-slate-500">
                    {{ event._count?.registrations || 0 }}/{{ event.capacity }}
                  </span>
                </div>
                <h3 class="font-heading font-semibold text-white text-base mb-2 line-clamp-2">{{ event.title }}</h3>
                <p class="text-sm text-slate-400 mb-3 line-clamp-2">{{ event.description }}</p>
                <div class="flex items-center gap-1.5 text-xs text-slate-500">
                  <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                  {{ event.location }}
                </div>
                <div class="flex items-center gap-1.5 text-xs text-slate-600 mt-1">
                  <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  {{ formatDate(event.startAt) }}
                </div>
              </div>
            </RouterLink>
          </SpotlightCard>
        </div>
      </div>

      <!-- Calendar view -->
      <div v-else class="rounded-2xl p-6 overflow-hidden"
        style="background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.07);">
        <FullCalendar :options="calendarOptions" />
      </div>
    </div>
  </div>
</template>

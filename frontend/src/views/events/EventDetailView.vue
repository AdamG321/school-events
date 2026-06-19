<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useEventsStore } from '../../stores/events'
import { useAuthStore } from '../../stores/auth'
import api from '../../api/client'

const route = useRoute()
const store = useEventsStore()
const auth = useAuthStore()
const registered = ref(false)
const loading = ref(false)

onMounted(async () => {
  await store.fetchOne(route.params.id as string)
  try {
    const res = await api.get(`/events/${route.params.id}/registration`)
    registered.value = res.data.registered
  } catch {}
})

async function toggleRegister() {
  loading.value = true
  try {
    if (registered.value) {
      await store.unregister(route.params.id as string)
      registered.value = false
    } else {
      await store.register(route.params.id as string)
      registered.value = true
    }
  } finally {
    loading.value = false
  }
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('hu-HU', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}
</script>

<template>
  <div class="pt-16 min-h-screen bg-surface">
    <div v-if="store.current" class="max-w-4xl mx-auto px-6 py-10">
      <!-- Cover -->
      <div class="w-full h-56 md:h-72 rounded-3xl overflow-hidden mb-8 shadow-lg">
        <img v-if="store.current.coverImageUrl" :src="store.current.coverImageUrl" class="w-full h-full object-cover" />
        <div v-else class="w-full h-full bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center text-7xl">
          📅
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <!-- Main -->
        <div class="md:col-span-2">
          <span class="text-xs font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">{{ store.current.category }}</span>
          <h1 class="font-heading font-bold text-3xl text-deep mt-3 mb-4">{{ store.current.title }}</h1>
          <p class="text-gray-600 leading-relaxed whitespace-pre-line">{{ store.current.description }}</p>

          <div v-if="store.current.tags?.length" class="flex flex-wrap gap-2 mt-6">
            <span v-for="tag in store.current.tags" :key="tag"
              class="text-xs px-3 py-1 bg-gray-100 text-gray-600 rounded-full">{{ tag }}</span>
          </div>
        </div>

        <!-- Sidebar -->
        <div class="space-y-4">
          <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
            <div>
              <p class="text-xs text-gray-400 mb-1">Kezdés</p>
              <p class="text-sm font-medium text-deep">{{ formatDate(store.current.startAt) }}</p>
            </div>
            <div>
              <p class="text-xs text-gray-400 mb-1">Befejezés</p>
              <p class="text-sm font-medium text-deep">{{ formatDate(store.current.endAt) }}</p>
            </div>
            <div>
              <p class="text-xs text-gray-400 mb-1">Helyszín</p>
              <p class="text-sm font-medium text-deep">{{ store.current.location }}</p>
            </div>
            <div v-if="store.current.capacity">
              <p class="text-xs text-gray-400 mb-1">Kapacitás</p>
              <p class="text-sm font-medium text-deep">
                {{ store.current._count?.registrations || 0 }} / {{ store.current.capacity }} fő
              </p>
              <div class="mt-1.5 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div class="h-full bg-primary rounded-full transition-all"
                  :style="{ width: `${Math.min(100, ((store.current._count?.registrations || 0) / store.current.capacity) * 100)}%` }" />
              </div>
            </div>

            <button v-if="auth.isLoggedIn" @click="toggleRegister" :disabled="loading"
              :class="['w-full py-3 rounded-xl font-semibold text-sm transition-all disabled:opacity-60', registered ? 'bg-red-50 text-red-500 border border-red-200 hover:bg-red-100' : 'bg-primary text-white hover:bg-primary-dark shadow-lg shadow-primary/20']">
              {{ loading ? '...' : registered ? 'Jelentkezés visszavonása' : 'Jelentkezés' }}
            </button>
          </div>

          <!-- Organizer -->
          <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <p class="text-xs text-gray-400 mb-2">Szervező</p>
            <p class="text-sm font-medium text-deep">{{ store.current.createdBy?.name }}</p>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="flex justify-center pt-32">
      <div class="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
    </div>
  </div>
</template>

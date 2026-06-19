<script setup lang="ts">
import { ref, onMounted } from 'vue'
import api from '../../api/client'

const pendingEvents = ref<any[]>([])
const users = ref<any[]>([])
const tab = ref<'events' | 'users'>('events')
const loading = ref(false)

onMounted(async () => {
  loading.value = true
  try {
    const [evRes, usRes] = await Promise.all([
      api.get('/admin/events/pending'),
      api.get('/admin/users'),
    ])
    pendingEvents.value = evRes.data
    users.value = usRes.data
  } finally {
    loading.value = false
  }
})

async function approveEvent(id: string) {
  await api.patch(`/admin/events/${id}/approve`)
  pendingEvents.value = pendingEvents.value.filter((e) => e.id !== id)
}

async function rejectEvent(id: string) {
  await api.patch(`/admin/events/${id}/reject`)
  pendingEvents.value = pendingEvents.value.filter((e) => e.id !== id)
}

async function changeRole(userId: string, role: string) {
  await api.patch(`/admin/users/${userId}/role`, { role })
  const u = users.value.find((u) => u.id === userId)
  if (u) u.role = role
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('hu-HU', { month: 'short', day: 'numeric' })
}
</script>

<template>
  <div class="pt-16 min-h-screen bg-surface">
    <div class="max-w-5xl mx-auto px-6 py-10">
      <h1 class="font-heading font-bold text-3xl text-deep mb-8">Admin Panel</h1>

      <!-- Tabs -->
      <div class="flex gap-2 mb-8">
        <button @click="tab = 'events'"
          :class="['px-5 py-2.5 rounded-xl text-sm font-medium transition-all', tab === 'events' ? 'bg-primary text-white' : 'bg-white border border-gray-200 text-gray-600']">
          Váró események ({{ pendingEvents.length }})
        </button>
        <button @click="tab = 'users'"
          :class="['px-5 py-2.5 rounded-xl text-sm font-medium transition-all', tab === 'users' ? 'bg-primary text-white' : 'bg-white border border-gray-200 text-gray-600']">
          Felhasználók ({{ users.length }})
        </button>
      </div>

      <div v-if="loading" class="flex justify-center py-16">
        <div class="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>

      <!-- Pending events -->
      <div v-else-if="tab === 'events'" class="space-y-4">
        <div v-if="pendingEvents.length === 0" class="text-center py-16 text-gray-400">
          <p class="text-4xl mb-3">✅</p>
          <p>Nincs jóváhagyásra váró esemény.</p>
        </div>
        <div v-for="event in pendingEvents" :key="event.id"
          class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center justify-between gap-4">
          <div class="flex-1 min-w-0">
            <h3 class="font-heading font-semibold text-deep truncate">{{ event.title }}</h3>
            <p class="text-sm text-gray-500 mt-0.5">{{ event.createdBy?.name }} · {{ formatDate(event.startAt) }} · {{ event.location }}</p>
            <p class="text-sm text-gray-400 mt-1 line-clamp-2">{{ event.description }}</p>
          </div>
          <div class="flex gap-2 shrink-0">
            <button @click="approveEvent(event.id)"
              class="px-4 py-2 rounded-xl bg-green-500 text-white text-sm font-medium hover:bg-green-600 transition-all">
              Jóváhagyás
            </button>
            <button @click="rejectEvent(event.id)"
              class="px-4 py-2 rounded-xl bg-red-50 text-red-500 border border-red-200 text-sm font-medium hover:bg-red-100 transition-all">
              Elutasítás
            </button>
          </div>
        </div>
      </div>

      <!-- Users -->
      <div v-else class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table class="w-full text-sm">
          <thead class="bg-gray-50 border-b border-gray-100">
            <tr>
              <th class="text-left px-5 py-3 font-medium text-gray-600">Név</th>
              <th class="text-left px-5 py-3 font-medium text-gray-600">Email</th>
              <th class="text-left px-5 py-3 font-medium text-gray-600">Szerepkör</th>
              <th class="text-left px-5 py-3 font-medium text-gray-600">Verified</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50">
            <tr v-for="user in users" :key="user.id" class="hover:bg-gray-50 transition-colors">
              <td class="px-5 py-3 font-medium text-deep">{{ user.name }}</td>
              <td class="px-5 py-3 text-gray-500">{{ user.email }}</td>
              <td class="px-5 py-3">
                <select :value="user.role" @change="changeRole(user.id, ($event.target as HTMLSelectElement).value)"
                  class="px-3 py-1 rounded-lg border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-primary/30">
                  <option>STUDENT</option>
                  <option>TEACHER</option>
                  <option>ADMIN</option>
                </select>
              </td>
              <td class="px-5 py-3">
                <span :class="['px-2 py-0.5 rounded-full text-xs font-medium', user.emailVerified ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600']">
                  {{ user.emailVerified ? 'Igen' : 'Nem' }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

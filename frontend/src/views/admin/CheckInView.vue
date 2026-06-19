<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import api from '../../api/client'
import QRCode from 'qrcode'

const route = useRoute()
const eventId = route.params.eventId as string

const event = ref<any>(null)
const attendees = ref<any[]>([])
const qrDataUrl = ref('')
const manualEmail = ref('')
const message = ref('')
const messageType = ref<'success' | 'error'>('success')

onMounted(async () => {
  const [evRes, attRes] = await Promise.all([
    api.get(`/events/${eventId}`),
    api.get(`/events/${eventId}/attendance`),
  ])
  event.value = evRes.data
  attendees.value = attRes.data

  const checkInUrl = `${window.location.origin}/checkin/${eventId}`
  qrDataUrl.value = await QRCode.toDataURL(checkInUrl, { width: 256, margin: 2 })
})

async function manualCheckIn() {
  if (!manualEmail.value) return
  try {
    const res = await api.post(`/events/${eventId}/checkin`, { email: manualEmail.value, method: 'MANUAL' })
    attendees.value.push(res.data)
    message.value = 'Sikeres check-in!'
    messageType.value = 'success'
    manualEmail.value = ''
  } catch (e: any) {
    message.value = e.response?.data?.message || 'Hiba történt.'
    messageType.value = 'error'
  }
  setTimeout(() => (message.value = ''), 3000)
}
</script>

<template>
  <div class="pt-16 min-h-screen bg-surface">
    <div class="max-w-4xl mx-auto px-6 py-10">
      <h1 class="font-heading font-bold text-3xl text-deep mb-2">Check-in</h1>
      <p v-if="event" class="text-gray-500 mb-8">{{ event.title }}</p>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <!-- QR kód -->
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center">
          <h2 class="font-heading font-semibold text-lg text-deep mb-4">QR kód</h2>
          <img v-if="qrDataUrl" :src="qrDataUrl" class="mx-auto rounded-xl" alt="QR" />
          <p class="text-xs text-gray-400 mt-3">Mutasd ezt a diákoknak belépéskor</p>
        </div>

        <!-- Manuális check-in -->
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 class="font-heading font-semibold text-lg text-deep mb-4">Manuális check-in</h2>
          <div class="flex gap-2">
            <input v-model="manualEmail" type="email" placeholder="diák@iskola.hu"
              class="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm transition" />
            <button @click="manualCheckIn"
              class="px-4 py-3 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-all">
              ✓
            </button>
          </div>
          <p v-if="message" :class="['text-sm mt-3 font-medium', messageType === 'success' ? 'text-green-600' : 'text-red-500']">
            {{ message }}
          </p>

          <div class="mt-6">
            <p class="text-sm font-medium text-gray-700 mb-3">Megjelentek ({{ attendees.length }} fő)</p>
            <div class="space-y-2 max-h-52 overflow-y-auto">
              <div v-for="a in attendees" :key="a.id"
                class="flex items-center gap-3 py-2 px-3 bg-green-50 rounded-xl">
                <span class="text-green-500 text-sm">✓</span>
                <div>
                  <p class="text-sm font-medium text-deep">{{ a.user?.name }}</p>
                  <p class="text-xs text-gray-400">{{ a.method }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

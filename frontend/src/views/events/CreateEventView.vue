<script setup lang="ts">
import { ref } from 'vue'
import { useEventsStore } from '../../stores/events'
import { useRouter } from 'vue-router'

const store = useEventsStore()
const router = useRouter()

const form = ref({
  title: '',
  description: '',
  category: 'Akadémiai',
  tags: '',
  startAt: '',
  endAt: '',
  location: '',
  onlineLink: '',
  capacity: '',
  waitlistEnabled: false,
  registrationDeadline: '',
})

const error = ref('')
const loading = ref(false)
const categories = ['Sport', 'Kulturális', 'Akadémiai', 'Kirándulás', 'Egyéb']

async function submit() {
  loading.value = true
  error.value = ''
  try {
    const payload = {
      ...form.value,
      tags: form.value.tags.split(',').map((t) => t.trim()).filter(Boolean),
      capacity: form.value.capacity ? parseInt(form.value.capacity) : undefined,
    }
    const event = await store.create(payload)
    router.push(`/events/${event.id}`)
  } catch (e: any) {
    error.value = e.response?.data?.message || 'Hiba történt.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="pt-16 min-h-screen bg-surface">
    <div class="max-w-2xl mx-auto px-6 py-10">
      <h1 class="font-heading font-bold text-3xl text-deep mb-8">Új esemény létrehozása</h1>

      <form @submit.prevent="submit" class="space-y-6">
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
          <h2 class="font-heading font-semibold text-lg text-deep">Alapadatok</h2>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Esemény neve *</label>
            <input v-model="form.title" required type="text" placeholder="Pl. Tavaszi sportnapok"
              class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-sm transition" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Leírás *</label>
            <textarea v-model="form.description" required rows="4" placeholder="Az esemény részletes leírása..."
              class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-sm resize-none transition" />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Kategória</label>
              <select v-model="form.category"
                class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm transition">
                <option v-for="c in categories" :key="c" :value="c">{{ c }}</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Tagek (vesszővel)</label>
              <input v-model="form.tags" type="text" placeholder="futball, sport, kültéri"
                class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm transition" />
            </div>
          </div>
        </div>

        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
          <h2 class="font-heading font-semibold text-lg text-deep">Időpont & Helyszín</h2>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Kezdés *</label>
              <input v-model="form.startAt" required type="datetime-local"
                class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm transition" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Befejezés *</label>
              <input v-model="form.endAt" required type="datetime-local"
                class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm transition" />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Helyszín *</label>
            <input v-model="form.location" required type="text" placeholder="Pl. Tornaterem / Iskola udvara"
              class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm transition" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Online link (opcionális)</label>
            <input v-model="form.onlineLink" type="url" placeholder="https://meet.google.com/..."
              class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm transition" />
          </div>
        </div>

        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
          <h2 class="font-heading font-semibold text-lg text-deep">Jelentkezés</h2>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Max résztvevők</label>
              <input v-model="form.capacity" type="number" min="1" placeholder="Korlátlan"
                class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm transition" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Jelentkezési határidő</label>
              <input v-model="form.registrationDeadline" type="datetime-local"
                class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm transition" />
            </div>
          </div>

          <label class="flex items-center gap-3 cursor-pointer">
            <input v-model="form.waitlistEnabled" type="checkbox"
              class="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary" />
            <span class="text-sm text-gray-700">Várólistás rendszer engedélyezése</span>
          </label>
        </div>

        <p v-if="error" class="text-red-500 text-sm text-center">{{ error }}</p>

        <button type="submit" :disabled="loading"
          class="w-full py-4 rounded-2xl bg-primary text-white font-semibold hover:bg-primary-dark transition-all disabled:opacity-60 shadow-lg shadow-primary/20">
          {{ loading ? 'Létrehozás...' : 'Esemény létrehozása' }}
        </button>
      </form>
    </div>
  </div>
</template>

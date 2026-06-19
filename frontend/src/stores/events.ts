import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '../api/client'

export interface Event {
  id: string
  title: string
  description: string
  category: string
  tags: string[]
  startAt: string
  endAt: string
  location: string
  onlineLink?: string
  capacity?: number
  waitlistEnabled: boolean
  registrationDeadline?: string
  status: 'PENDING' | 'ACTIVE' | 'CANCELLED'
  coverImageUrl?: string
  createdBy: { id: string; name: string }
  _count?: { registrations: number }
}

export const useEventsStore = defineStore('events', () => {
  const events = ref<Event[]>([])
  const current = ref<Event | null>(null)
  const loading = ref(false)

  async function fetchAll(params?: Record<string, string>) {
    loading.value = true
    try {
      const res = await api.get('/events', { params })
      events.value = res.data
    } finally {
      loading.value = false
    }
  }

  async function fetchOne(id: string) {
    const res = await api.get(`/events/${id}`)
    current.value = res.data
  }

  async function create(data: Partial<Event>) {
    const res = await api.post('/events', data)
    events.value.unshift(res.data)
    return res.data
  }

  async function update(id: string, data: Partial<Event>) {
    const res = await api.patch(`/events/${id}`, data)
    const idx = events.value.findIndex((e) => e.id === id)
    if (idx !== -1) events.value[idx] = res.data
  }

  async function register(eventId: string) {
    await api.post(`/events/${eventId}/register`)
  }

  async function unregister(eventId: string) {
    await api.delete(`/events/${eventId}/register`)
  }

  return { events, current, loading, fetchAll, fetchOne, create, update, register, unregister }
})

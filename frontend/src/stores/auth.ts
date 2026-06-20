import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useAuth, useUser } from '@clerk/vue'
import api from '../api/client'

export interface User {
  id: string
  name: string
  email: string
  role: 'STUDENT' | 'TEACHER' | 'ADMIN'
  avatar?: string
}

export const useAuthStore = defineStore('auth', () => {
  const { isSignedIn, signOut } = useAuth()
  const { user: clerkUser } = useUser()
  const dbUser = ref<User | null>(null)

  const isLoggedIn = computed(() => !!isSignedIn.value && !!dbUser.value)
  const isAdmin = computed(() => dbUser.value?.role === 'ADMIN')
  const isTeacher = computed(() => dbUser.value?.role === 'TEACHER' || dbUser.value?.role === 'ADMIN')
  const user = computed(() => dbUser.value)

  async function fetchMe() {
    if (!isSignedIn.value) return
    try {
      const res = await api.get('/auth/me')
      dbUser.value = res.data
    } catch {
      dbUser.value = null
    }
  }

  async function syncUser(role: string) {
    const res = await api.post('/auth/sync', { role })
    dbUser.value = res.data
    return res.data as User
  }

  async function logout() {
    await signOut()
    dbUser.value = null
  }

  return {
    isSignedIn,
    clerkUser,
    dbUser,
    user,
    isLoggedIn,
    isAdmin,
    isTeacher,
    fetchMe,
    syncUser,
    logout,
  }
})

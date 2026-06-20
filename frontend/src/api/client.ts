import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
})

api.interceptors.request.use(async (config) => {
  const clerk = (window as any).Clerk
  if (clerk?.session) {
    const token = await clerk.session.getToken()
    if (token) config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      const clerk = (window as any).Clerk
      clerk?.signOut()
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export default api

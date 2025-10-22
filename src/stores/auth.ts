import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import apiClient from '@/api'
import { isAxiosError } from 'axios'
import { jwtDecode } from 'jwt-decode'

interface JwtPayload {
  email: string
  role: string
  sub: number
  iat: number
  exp: number
}

interface User {
  userId: number
  email: string
  role: string
}

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(sessionStorage.getItem('token'))
  const user = ref<User | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const router = useRouter()

  function setToken(newToken: string | null) {
    token.value = newToken
    if (newToken) {
      sessionStorage.setItem('token', newToken)
      try {
        const decoded = jwtDecode<JwtPayload>(newToken)
        user.value = {
          userId: decoded.sub,
          email: decoded.email,
          role: decoded.role,
        }
      } catch (e) {
        console.error('Failed to decode token:', e)
        user.value = null
      }
    } else {
      sessionStorage.removeItem('token')
      user.value = null
    }
  }

  if (token.value) {
    setToken(token.value)
  }

  async function login(credentials: { email: string; password: string }) {
    loading.value = true
    error.value = null
    try {
      const response = await apiClient.post('/auth/login', credentials)
      setToken(response.data.access_token)
      router.push('/dashboard')
    } catch (err: any) {
      if (isAxiosError(err) && err.response) {
        error.value = err.response.data.message || 'Invalid email or password.'
      } else {
        error.value = 'A network error occurred.'
      }
    } finally {
      loading.value = false
    }
  }

  async function logout() {
    try {
      await apiClient.post('/auth/logout')
    } catch (e) {
      console.error('Logout API call failed, logging out client-side.')
    }
    setToken(null)
    router.push('/login')
  }

  return { token, user, loading, error, login, logout }
})

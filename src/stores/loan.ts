import { defineStore } from 'pinia'
import { ref } from 'vue'
import apiClient from '@/api'
import { isAxiosError } from 'axios'

export interface Loan {
  id: string
  applicant: {
    name: string
    email: string
    totalLoan?: number 
  }
  amount: number
  status: 'pending' | 'active'
  maturityDate: string
}

export const useLoanStore = defineStore('loan', () => {
  const loans = ref<Loan[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchLoans(status?: string) {
    loading.value = true
    error.value = null


    const params = status && status !== 'all' ? { status } : undefined

    try {
      const response = await apiClient.get<Loan[]>('/loans', { params })
      loans.value = response.data
    } catch (err) {
      if (isAxiosError(err)) {
        error.value = err.response?.data?.message || 'Failed to fetch loans.'
      } else {
        error.value = 'A network error occurred.'
      }
    } finally {
      loading.value = false
    }
  }

  // Deletes a loan by its ID
  async function deleteLoan(loanId: string) {
    loading.value = true 
    error.value = null
    try {
      await apiClient.delete(`/loans/${loanId}/delete`)

      await fetchLoans()
    } catch (err) {
      if (isAxiosError(err)) {
        if (err.response?.status === 403) {
          error.value = 'You do not have permission to delete this.'
        } else {
          error.value = err.response?.data?.message || 'Failed to delete loan.'
        }
      } else {
        error.value = 'A network error occurred.'
      }
    } finally {
      loading.value = false
    }
  }

  return { loans, loading, error, fetchLoans, deleteLoan }
})
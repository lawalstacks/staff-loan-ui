<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useLoanStore } from '@/stores/loan'
import type { Loan } from '@/stores/loan' // Import the type

const authStore = useAuthStore()
const loanStore = useLoanStore()

// This ref will be bound to our <select> dropdown
const filterStatus = ref<'all' | 'pending' | 'active'>('all')

// Function to handle filtering
const handleFetchLoans = () => {
  loanStore.fetchLoans(filterStatus.value)
}

// Fetch loans when the component is first loaded
onMounted(() => {
  loanStore.fetchLoans()
})

// Function to handle deletion
const handleDelete = async (loanId: string) => {
  if (confirm('Are you sure you want to delete this loan?')) {
    await loanStore.deleteLoan(loanId)
  }
}
</script>

<template>
  <div class="dashboard-container">
    <header class="dashboard-header">
      <h1>Staff Dashboard</h1>
      <div class="user-info">
        Logged in as: <strong>{{ authStore.user?.email }}</strong> ({{
          authStore.user?.role
        }})
        <button @click="authStore.logout()" class="logout-button">Log Out</button>
      </div>
    </header>

    <main>
      <div class="controls">
        <label for="status-filter">Filter by status:</label>
        <select
          id="status-filter"
          v-model="filterStatus"
          @change="handleFetchLoans"
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="active">Active</option>
        </select>
      </div>

      <div v-if="loanStore.loading" class="loading">Fetching loans...</div>
      <div v-if="loanStore.error" class="error-message">
        {{ loanStore.error }}
      </div>

      <div v-if="!loanStore.loading && loanStore.loans.length > 0" class="loan-list">
        <table>
          <thead>
            <tr>
              <th>Applicant</th>
              <th>Email</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Maturity Date</th>
              <th
                v-if="
                  authStore.user?.role === 'admin' ||
                  authStore.user?.role === 'superAdmin'
                "
              >
                Total Loan
              </th>
              <th v-if="authStore.user?.role === 'superAdmin'">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="loan in loanStore.loans" :key="loan.id">
              <td>{{ loan.applicant.name }}</td>
              <td>{{ loan.applicant.email }}</td>
              <td>${{ loan.amount.toLocaleString() }}</td>
              <td>
                <span :class="`status-${loan.status}`">{{ loan.status }}</span>
              </td>
              <td>{{ new Date(loan.maturityDate).toLocaleDateString() }}</td>
              
              <td
                v-if="
                  authStore.user?.role === 'admin' ||
                  authStore.user?.role === 'superAdmin'
                "
              >
                ${{ loan.applicant.totalLoan?.toLocaleString() || 'N/A' }}
              </td>

              <td v-if="authStore.user?.role === 'superAdmin'">
                <button
                  @click="handleDelete(loan.id)"
                  class="delete-button"
                >
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="!loanStore.loading && loanStore.loans.length === 0" class="no-loans">
        No loans found.
      </div>
    </main>
  </div>
</template>

<style scoped>
/* Add some basic styling */
.dashboard-container {
  width: 90%;
  max-width: 1200px;
  margin: 2rem auto;
  font-family: sans-serif;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 2px solid #eee;
  padding-bottom: 1rem;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.logout-button {
  background: #f44336;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}

.controls {
  margin: 2rem 0;
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.controls select {
  padding: 0.5rem;
  font-size: 1rem;
  border-radius: 4px;
}

.loading {
  font-size: 1.2rem;
  color: #555;
  text-align: center;
  padding: 2rem;
}

.error-message {
  background: #fde8e8;
  color: #a30000;
  padding: 1rem;
  border-radius: 8px;
  text-align: center;
}

.loan-list table {
  width: 100%;
  border-collapse: collapse;
}

.loan-list th,
.loan-list td {
  border: 1px solid #ddd;
  padding: 0.75rem;
  text-align: left;
}

.loan-list th {
  background-color: #f4f4f4;
}

.status-pending {
  color: #f59e0b;
  font-weight: bold;
}

.status-active {
  color: #10b981;
  font-weight: bold;
}

.delete-button {
  background: none;
  border: none;
  color: #f44336;
  cursor: pointer;
  text-decoration: underline;
}
</style>
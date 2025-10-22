<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

const email = ref<string>('')
const password = ref<string>('')
const rememberMe = ref(false)

// Logic for password visibility
const passwordFieldType = ref<'password' | 'text'>('password')
const togglePasswordVisibility = () => {
  passwordFieldType.value =
    passwordFieldType.value === 'password' ? 'text' : 'password'
}

const handleLogin = async () => {
  await authStore.login({
    email: email.value,
    password: password.value,
  })
}
</script>

<template>
  <div class="login-wrapper">
    <div class="image-panel">
      <div class="logo-placeholder">
           <img src="@/assets/logo.png" alt="logo" />
      </div>

      <div class="main-image-placeholder">
         <img src="@/assets/loginPageImage.png" alt="Team" class="main-image-content"/>
      </div>

      <div class="image-panel-text">
        <h2>Team Achieve</h2>
        <p>Your perfect solution for funding your desires</p>
      </div>
    </div>

    <!-- ======== RIGHT SIDE (FORM) ======== -->
    <div class="form-panel">
      <div class="form-container">
        <div class="form-header">
          <h1>Welcome Back</h1>
          <p>Enter your email address and password to access your account.</p>
        </div>

        <!-- Form -->
        <form @submit.prevent="handleLogin" class="login-form">
          <!-- Email -->
          <div class="form-group">
            <label for="email">Email Address <span class="required">*</span></label>
            <input
              type="email"
              id="email"
              v-model="email"
              placeholder="Enter your email"
              required
            />
          </div>

          <!-- Password -->
          <div class="form-group">
            <label for="password">Password <span class="required">*</span></label>
            <div class="password-wrapper">
              <input
                :type="passwordFieldType"
                id="password"
                v-model="password"
                placeholder="Enter your password"
                required
              />
              <span class="password-toggle-icon" @click="togglePasswordVisibility">
                <svg
                  v-if="passwordFieldType === 'password'"
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
                <svg
                  v-else
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07l-5.06-5.06M1 1l22 22"></path>
                </svg>
              </span>
            </div>
          </div>

          <!-- Remember Me & Forgot Password -->
          <div class="form-options">
            <div class="remember-me">
              <input type="checkbox" id="remember" v-model="rememberMe" />
              <label for="remember">Remember me</label>
            </div>
            <a href="#" class="forgot-password">Forgot Password?</a>
          </div>

          <!-- Error Message -->
          <div v-if="authStore.error" class="error-message">
            {{ authStore.error }}
          </div>

          <!-- Submit Button -->
          <button type="submit" class="login-button" :disabled="authStore.loading">
            {{ authStore.loading ? 'Signing in...' : 'Sign in' }}
          </button>
        </form>

        <!-- Sign Up Link -->
        <div class="signup-link">
          Don't have an account? <a href="#">Sign up</a>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Color Palette */
:root {
  --bg-light-purple: #FCFCFC;
  --bg-white: #fcfcfc;
  --brand-purple: #61227d;
  --text-dark: #333;
  --text-light: #555;
  --border-color: #e0e0e0;
}

.login-wrapper {
  display: flex;
  min-height: 100vh;
  width: 100%;
  background-color: var(--bg-light-purple);
}

/* ======== Left Panel (Image) ======== */
.image-panel {
  flex: 1;
  display: none; 
  flex-direction: column;
  align-items: center;
  justify-content: flex-start; 
  padding: 3rem;
  background-color: #F8EAFF;
}

.logo-placeholder {
  width: 100%;
  margin-bottom: 2rem;
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--brand-purple);
}

.logo-placeholder img { 
  max-width: 150px;
  height: auto;
  display: block;
}
.main-image-placeholder {
  width: 100%;
  background-color: var(--brand-purple);
  border-radius: 10px;
  display: flex;
  position: relative;
  overflow: hidden;
  align-items: center;
  justify-content: left;
  font-size: 1.2rem;
  color: var(--brand-purple);
  margin-bottom: 2rem;
}


.main-image-content {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block; 
  border-radius: 20px; 
}


.image-panel-text {
  text-align: center;
  color: var(--brand-purple);
}

.image-panel-text h2 {
  font-size: 1.8rem;
  margin-bottom: 0.5rem;
  color: #7a4a91;
  font-family: 'Lora', serif;
}

.image-panel-text p {
  font-size: 1.1rem;
  color: #5E5E5E;
  font-weight: 700;
  font-family: 'Lora', serif;
}

/* ======== Right Panel (Form) ======== */
.form-panel {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background-color: var(--bg-white);
}

.form-container {
  width: 100%;
  max-width: 450px;
}

.form-header {
  text-align: left;
  margin-bottom: 2rem
}

.form-header h1 {
  font-size: 2.2rem;
  font-weight: 700;
  text-align: center;
  font-family: 'Lora', serif;
  margin-bottom: 0.5rem;
  color: #61227D;
}

.form-header p {
    text-align: center;
  font-size: 1rem;
  color: var(--text-light);
}

.login-form {
  width: 100%;
}

.form-group {
  margin-bottom: 1.25rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  font-size: 0.9rem;
  color: var(--text-dark);
}

.form-group label .required {
  color: #d9534f;
}

.form-group input[type='email'],
.password-wrapper input {
  width: 100%;
  padding: 0.85rem 1rem;
  font-size: 1rem;
   border: 1px solid #bbb;
  border-radius: 4px;
  box-sizing: border-box;
}

.password-wrapper {
  position: relative;
}

.password-toggle-icon {
  position: absolute;
  top: 50%;
  right: 1rem;
  transform: translateY(-50%);
  cursor: pointer;
  color: var(--text-light);
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
}

.remember-me {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.remember-me label {
  color: var(--text-light);
  margin-bottom: 0;
}

.remember-me input {
  accent-color: var(--brand-purple);
}

.forgot-password {
  color: var(--brand-purple);
  font-weight: 600;
  text-decoration: none;
}

.error-message {
  background: #fde8e8;
  color: #a30000;
  padding: 0.75rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  text-align: center;
  font-size: 0.9rem;
}

.login-button {
  width: 100%;
  padding: 0.85rem;
  font-size: 1.1rem;
  font-weight: 600;
  color: white;
  background-color: #61227D;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-bottom: 1.5rem;
}

.login-button:disabled {
  background-color: #a37bba;
  cursor: not-allowed;
}

.login-button:not(:disabled):hover {
  background-color: #4a1b61;
}

.signup-link {
  text-align: center;
  font-size: 0.9rem;
  color: var(--text-light);
}

.signup-link a {
  color: var(--brand-purple);
  font-weight: 600;
  text-decoration: none;
}

/* ======== Responsive (Desktop) ======== */
@media (min-width: 992px) {
  .image-panel {
    display: flex;
  }

  .form-panel {
    flex: 0 0 50%;
    max-width: 50%;
    box-shadow: -10px 0 20px rgba(0, 0, 0, 0.05); 
  }
}
</style>

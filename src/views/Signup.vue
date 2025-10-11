<template>
  <div class="login-container">
    <div class="login-card">
      <h1 class="login-title">Create an Account</h1>

      <form @submit.prevent="handleSignup" class="login-form">
        <!-- Email -->
        <div class="form-group">
          <label>Email</label>
          <input v-model="email" type="email" required />
        </div>

        <!-- Username -->
        <div class="form-group">
          <label>Username</label>
          <input v-model="username" type="text" required />
        </div>

        <!-- Password -->
        <div class="form-group password-group">
          <label>Password</label>
          <div class="password-wrapper">
            <input
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              required
            />
            <button type="button" class="toggle-btn" @click="togglePassword"
            :aria-label="showPassword ? 'Hide password' : 'Show password'">
              {{ showPassword ? '🙈' : '👁️' }}
            </button>
          </div>
        </div>

        <!-- Confirm Password -->
        <div class="form-group password-group">
          <label>Confirm Password</label>
          <div class="password-wrapper">
            <input
              v-model="confirmPassword"
              :type="showConfirm ? 'text' : 'password'"
              required
            />
            <button type="button" class="toggle-btn" @click="toggleConfirmPassword"
            :aria-label="showConfirm ? 'Hide password' : 'Show password'">
              {{ showConfirm ? '🙈' : '👁️' }}
            </button>
          </div>
        </div>

        <!-- Signup button -->
        <button type="submit" class="login-btn" :disabled="loading">
          <span v-if="!loading">Sign Up</span>
          <span v-else class="spinner"></span>
        </button>
      </form>

      <!-- Error -->
      <p v-if="error" class="error-msg">{{ error }}</p>

      <!-- Back to login -->
      <p class="signup-text">
        Already have an account?
        <router-link to="/login" class="signup-link">Login</router-link>
      </p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { signup } from '../services/authentications'

const username = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const showPassword = ref(false)
const showConfirm = ref(false)
const error = ref('')
const loading = ref(false)
const router = useRouter()


function togglePassword() {
  showPassword.value = !showPassword.value
}

function toggleConfirmPassword() {
  showConfirm.value = !showConfirm.value
}

async function handleSignup() {
  if (password.value !== confirmPassword.value) {
    error.value = 'Passwords do not match'
    return
  }

  loading.value = true
  error.value = ''
  try {
    await signup(username.value, email.value, password.value)
    await router.push('/email-confirmation')
  } catch (err: any) {
  const data = err.response?.data
    if (data) {
    if (data.email) {
      error.value = data.email[0]   // show first email error
    } else if (data.username) {
      error.value = data.username[0]  // show first username error
    } else if (data.password) {
      error.value = data.password[0]
    } else {
      error.value = JSON.stringify(data) // fallback: show raw errors
    }
  } else {
    error.value = 'Signup failed. Please try again.'
  }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* Container */
.login-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #f4f6f8;
  font-family: Arial, sans-serif;
}

/* Card */
.login-card {
  width: 100%;
  max-width: 400px;
  padding: 2rem;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* Title */
.login-title {
  font-size: 1.8rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
  text-align: center;
  color: #333;
}

/* Form */
.login-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* Form group */
.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  font-weight: 600;
  color: #444;
}

.form-group input {
  padding: 0.6rem 0.8rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s ease-in-out;
}

.form-group input:focus {
  border-color: #007bff;
  outline: none;
}

/* Password group */
.password-wrapper {
  display: flex;
  align-items: center;
  position: relative;
}

.password-wrapper input {
  flex: 1;
  padding-right: 2.5rem;
}

.toggle-btn {
  position: absolute;
  right: 8px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.1rem;
}

/* Button */
.login-btn {
  padding: 0.75rem;
  background: #007bff;
  color: white;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s ease-in-out;
}

.login-btn:hover {
  background: #0056b3;
}

/* Error message */
.error-msg {
  margin-top: 1rem;
  text-align: center;
  color: #d9534f;
  font-size: 0.9rem;
}

/* Signup */
.signup-text {
  margin-top: 1.5rem;
  text-align: center;
  font-size: 0.9rem;
  color: #555;
}

.signup-link {
  color: #007bff;
  text-decoration: none;
  font-weight: 600;
}

.signup-link:hover {
  text-decoration: underline;
}

.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid #ffffff;
  border-top: 2px solid transparent;
  border-radius: 50%;
  display: inline-block;
  animation: spin 0.8s linear infinite;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>

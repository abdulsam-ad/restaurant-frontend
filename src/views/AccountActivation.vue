<template>
  <div class="activation-container">
    <div class="activation-card">
      <h2 v-if="loading">Activating your account...</h2>
      <p v-if="error" class="error-msg">{{ error }}</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { accountActivation } from '../services/authentications'

const route = useRoute()
const router = useRouter()
const loading = ref(true)
const error = ref('')

onMounted(async () => {
  const token = route.params.token as string
    console.log("token:", token)

  try {
    const user_type = await accountActivation(token)
    console.log("Activation response:", user_type)

    if (user_type === 'user') {
      await router.push('/user-dashboard')
    } else {
      await router.push('/login')
    }
  } catch (err: any) {
    error.value = err.response?.data?.detail || 'Activation failed. Please try again.'
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.activation-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
}
.activation-card {
  padding: 2rem;
  border-radius: 8px;
  background: #fff;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}
.error-msg {
  color: red;
  text-align: center;
}
</style>

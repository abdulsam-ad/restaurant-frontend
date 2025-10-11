<template>
  <div class="confirmation-container">
    <div class="confirmation-card">
      <h1 class="confirmation-title">Confirm Your Email</h1>
      <p class="confirmation-text">
        We've sent a confirmation link to your email. <br />
        Please check your inbox and verify your account to continue.
      </p>

      <router-link to="/login" class="back-to-login">
        Back to Login
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
// no logic needed here, just a static confirmation page
</script>

<style scoped>
.confirmation-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #f4f6f8;
  font-family: Arial, sans-serif;
}

.confirmation-card {
  width: 100%;
  max-width: 420px;
  padding: 2rem;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.confirmation-title {
  font-size: 1.8rem;
  font-weight: bold;
  margin-bottom: 1rem;
  color: #333;
}

.confirmation-text {
  font-size: 1rem;
  color: #555;
  margin-bottom: 2rem;
  line-height: 1.5;
}

.back-to-login {
  display: inline-block;
  padding: 0.75rem 1.2rem;
  background: #007bff;
  color: white;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 8px;
  text-decoration: none;
  transition: background 0.2s ease-in-out;
}

.back-to-login:hover {
  background: #0056b3;
}
</style>

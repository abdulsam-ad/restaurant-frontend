<template>
  <div class="page">
    <!-- Header -->
    <div class="header" @click="refreshUsers">
      <h2 class="clickable-header">
        👥 Users
        <span class="refresh-icon" :class="{ spinning: isRefreshing }">🔄</span>
      </h2>
      <RouterLink to="/super/users/new/" class="btn-primary">
        ➕ Create
      </RouterLink>
    </div>

    <!-- Users Grid -->
    <div class="users-grid" v-if="users.length">
      <div
        v-for="u in users"
        :key="u.id"
        class="user-card"
      >
        <!-- User Image -->
        <div class="card-image">
          <img v-if="u.image" :src="u.image" alt="User Image" />
          <div v-else class="no-img">👤</div>
        </div>

        <!-- User Info -->
        <div class="card-body">
          <h3 class="username">👤 {{ u.username }}</h3>
          <span class="badge" :class="u.user_type">⭐ {{ u.user_type }}</span>

          <div class="restaurants">
            <template v-if="u.user_type === 'waiter'">
              <RouterLink
                v-if="u.restaurant"
                :to="`/super/restaurants/${u.restaurant.id}`"
                class="chip green-chip"
              >
                🏨 {{ u.restaurant.name }}
              </RouterLink>
              <span v-else>❓</span>
            </template>
            <template v-else-if="u.user_type === 'restaurant_owner'">
              <RouterLink
                v-for="r in u.owned_restaurants"
                :key="r.id"
                :to="`/super/restaurants/${r.id}`"
                class="chip blue-chip"
              >
                🍽️ {{ r.name }}
              </RouterLink>
              <span v-if="!u.owned_restaurants.length">❓</span>
            </template>
            <span v-else></span>
          </div>

          <!-- User details button -->
          <div class="details-btn-container">
            <RouterLink
                :to="u.username === user.username ? '/super/profile' : `/super/users/${u.username}`"
                class="btn-details">
              🔎 Details
            </RouterLink>
          </div>
        </div>
      </div>
    </div>

    <!-- No Users -->
    <p v-else class="no-users">🚫 No users found.</p>

    <!-- Pagination -->
    <div class="pagination" v-if="nextPage || prevPage">
      <button class="btn-secondary" :disabled="!prevPage" @click="loadPage(prevPage, currentPage - 1)">
        ⬅ Previous
      </button>
      <span class="page-info">📄 Page {{ currentPage }}</span>
      <button class="btn-secondary" :disabled="!nextPage" @click="loadPage(nextPage, currentPage + 1)">
        Next ➡
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { fetchUsers } from '../../services/users.ts'
import { useUserStore } from "../../stores/user.ts";


const userStore = useUserStore();
const user = userStore.user

const users = ref<any[]>([])
const errorMsg = ref<string>('')
const nextPage = ref<string | null>(null)
const prevPage = ref<string | null>(null)
const currentPage = ref<number>(1)
const isRefreshing = ref(false)

async function loadUsers(url: string | null = null, page = 1) {
  try {
    isRefreshing.value = true
    const data: any = url ? await fetchUsers(url) : await fetchUsers(`?page=${page}`)
    users.value = data.results
    nextPage.value = data.next
    prevPage.value = data.previous
    currentPage.value = page
  } catch (err: any) {
    console.error('Failed to load users', err)
    errorMsg.value = err.message || 'Failed to load users'
  } finally {
    setTimeout(() => (isRefreshing.value = false), 600) // smooth stop
  }
}

function loadPage(url: string | null, page: number) {
  if (url) loadUsers(url, page)
}

function refreshUsers() {
  loadUsers(`?page=${currentPage.value}`, currentPage.value)
}

onMounted(() =>   loadUsers())
</script>

<style scoped>
/* Page layout */
.page {
  padding: 5px;
  border-radius: 25px;
  font-family: 'Inter', sans-serif;
  background: linear-gradient(135deg, #f9fafb, #f3f4f6);
  min-height: 100vh;
  color: #111827;
}

/* Header */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
}

.clickable-header {
  font-size: 2rem;
  font-weight: 800;
  color: #1f2937;
  cursor: pointer;
  transition: transform 0.3s ease, color 0.3s ease;
  letter-spacing: -0.5px;
}

.clickable-header:hover {
  transform: rotate(-1deg) scale(1.08);
  color: #2563eb;
  text-shadow: 0 2px 6px rgba(37, 99, 235, 0.25);
}

.refresh-icon {
  font-size: 1.3rem;
  display: inline-block;
  transition: transform 0.6s linear;
}

.refresh-icon.spinning {
  transform: rotate(360deg);
}

/* Grid */
.users-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 20px;
}

/* User Card */
.user-card {
  background: rgba(255, 255, 255, 0.8);
  border-radius: 16px;
  backdrop-filter: blur(12px);
  border: 1px solid rgba(229, 231, 235, 0.6);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: all 0.35s ease;
  box-shadow: 0 6px 18px rgba(0,0,0,0.08);
  animation: fadeIn 0.6s ease-in-out;
}

.user-card:hover {
  transform: translateY(-8px) scale(1.03);
  box-shadow: 0 12px 28px rgba(0,0,0,0.15);
}

/* Image */
.card-image {
  height: 190px;
  background: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.user-card:hover .card-image img {
  transform: scale(1.07);
}

.no-img {
  font-size: 2.4rem;
  color: #9ca3af;
}

/* Card Body */
.card-body {
  padding: 18px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex: 1;
}

.username {
  font-size: 1.4rem;
  font-weight: 700;
  margin-bottom: 14px;
  color: #1d4ed8;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}

.badge {
  display: inline-block;
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: capitalize;
}

.badge.super_admin { background: #fce7f3; color: #969d00; }
.badge.restaurant_owner { background: #fce7f3; color: #9d174d; }
.badge.waiter { background: #fef9c3; color: #854d0e; }
.badge.user { background: #e0f2fe; color: #075985; }

/* Restaurants */
.restaurants {
  margin-top: 8px;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.chip {
  display: inline-block;
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.25s ease;
  cursor: pointer;
}

.blue-chip {
  background: #f3f4f6;
  color: #2563eb;
  border: 1px solid #dbeafe;
}

.blue-chip:hover {
  background: #2563eb;
  color: white;
  transform: scale(1.08);
  box-shadow: 0 3px 8px rgba(37, 99, 235, 0.4);
}

.green-chip {
  background: #f3f4f6;
  color: #059669;
  border: 1px solid #d1fae5;
}

.green-chip:hover {
  background: #059669;
  color: white;
  transform: scale(1.08);
  box-shadow: 0 3px 8px rgba(5, 150, 105, 0.4);
}

/* Buttons */
.btn-primary {
  background: linear-gradient(135deg, #2563eb, #3b82f6);
  color: white;
  padding: 8px 10px;
  border-radius: 6px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.2s ease;
}

.btn-primary:hover {
  background: linear-gradient(135deg, #1d4ed8, #2563eb);
  transform: translateY(-2px) scale(1.03);
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.4);
}

.btn-secondary {
  background: #e5e7eb;
  padding: 9px 16px;
  border-radius: 10px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.25s ease;
}

.btn-secondary:hover:not(:disabled) {
  background: #d1d5db;
  transform: translateY(-2px);
}

.btn-secondary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Pagination */
.pagination {
  margin-top: 24px;
  display: flex;
  gap: 12px;
  justify-content: center;
  align-items: center;
}

.page-info {
  padding: 6px 14px;
  border-radius: 20px;
  background: #f3f4f6;
  font-weight: 600;
  color: #374151;
}

/* Animations */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.no-users {
  text-align: center;
  font-size: 1.1rem;
  color: #6b7280;
  margin-top: 30px;
}

.details-btn-container {
  margin-top: 10px;
  display: flex;
  justify-content: flex-end;
}

.btn-details {
  background: linear-gradient(135deg, #059669, #10b981);
  color: white;
  padding: 7px 16px;
  border-radius: 10px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.25s ease;
}

.btn-details:hover {
  background: linear-gradient(135deg, #047857, #059669);
  transform: translateY(-2px) scale(1.03);
  box-shadow: 0 4px 12px rgba(5, 150, 105, 0.4);
}

</style>

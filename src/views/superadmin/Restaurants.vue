<template>
  <div class="page">
    <!-- Header -->
    <div class="header" @click="refreshRestaurants">
      <h2 class="clickable-header">
        🍴 Restaurants
        <span class="refresh-icon" :class="{ spinning: isRefreshing }">🔄</span>
      </h2>
      <RouterLink to="/super/restaurants/new/" class="btn-primary">
        ➕ Create
      </RouterLink>
    </div>

    <!-- Restaurants Grid -->
    <div class="restaurants-grid" v-if="restaurants.length">
      <div
        v-for="r in restaurants"
        :key="r.id"
        class="restaurant-card"
      >
        <!-- Restaurant Image -->
        <div class="card-image">
          <img v-if="r.images && r.images.length > 0" :src="r.images[0].image" alt="Restaurant Image" />
          <div v-else class="no-img">🏠</div>
        </div>

        <!-- Restaurant Info -->
        <div class="card-body">
          <h3 class="restaurant-name">{{ r.name }}</h3>

          <!-- Owners -->
          <div class="chips-section">
            <h4>👨‍🍳 Owners</h4>
            <div class="chips">
              <span v-if="r.owners_detail?.length">
                <RouterLink
                  v-for="o in r.owners_detail"
                  :key="o.id"
                  :to="`/super/users/${o.username}`"
                  class="chip blue-chip"
                >
                  👨‍💼 {{ o.username }}
                </RouterLink>
              </span>
              <span v-else>❓</span>
            </div>
          </div>

          <!-- Waiters -->
          <div class="chips-section">
            <h4>🧑‍🍽 Waiters</h4>
            <div class="chips">
              <span v-if="r.waiters_detail?.length">
                <RouterLink
                  v-for="w in r.waiters_detail"
                  :key="w.id"
                  :to="`/super/users/${w.username}`"
                  class="chip green-chip"
                >
                  🙋 {{ w.username }}
                </RouterLink>
              </span>
              <span v-else>❓</span>
            </div>
          </div>

          <!-- Details Button -->
          <div class="details-btn-container">
            <RouterLink :to="`/super/restaurants/${r.id}`" class="btn-details">
              🔎 Details
            </RouterLink>
          </div>
        </div>
      </div>
    </div>

    <!-- No Restaurants -->
    <p v-else class="no-restaurants">🚫 No restaurants found.</p>

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
import { ref, onMounted } from "vue"
import { fetchRestaurants } from "../../services/restaurants.ts"

const restaurants = ref<any[]>([])
const errorMsg = ref<string>('')
const nextPage = ref<string | null>(null)
const prevPage = ref<string | null>(null)
const currentPage = ref<number>(1)
const isRefreshing = ref(false)

async function loadRestaurants(url: string | null = null, page = 1) {
  try {
    isRefreshing.value = true
    const data: any = url ? await fetchRestaurants(url) : await fetchRestaurants(`?page=${page}`)
    restaurants.value = data.results
    nextPage.value = data.next
    prevPage.value = data.previous
    currentPage.value = page
  } catch (err: any) {
    console.error("Failed to load restaurants", err)
    errorMsg.value = err.message || 'Failed to load restaurants'
  } finally {
    setTimeout(() => (isRefreshing.value = false), 600) // smooth stop
  }
}

function loadPage(url: string | null, page: number) {
  if (url) loadRestaurants(url, page)
}

function refreshRestaurants() {
  loadRestaurants(`?page=${currentPage.value}`)
}

onMounted(() => loadRestaurants())
</script>

<style scoped>
/* Page */
.page {
  padding: 5px;
  border-radius: 25px;
  font-family: "Inter", sans-serif;
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
.restaurants-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 24px;
}

/* Restaurant Card */
.restaurant-card {
  background: rgba(255, 255, 255, 0.8);
  border-radius: 20px;
  backdrop-filter: blur(12px);
  border: 1px solid rgba(229, 231, 235, 0.6);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: all 0.35s ease;
  box-shadow: 0 6px 18px rgba(0,0,0,0.08);
  animation: fadeIn 0.6s ease-in-out;
}

.restaurant-card:hover {
  transform: translateY(-8px) scale(1.03);
  box-shadow: 0 12px 28px rgba(0,0,0,0.15);
}

/* Card Image */
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

.restaurant-card:hover .card-image img {
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

.restaurant-name {
  font-size: 1.4rem;
  font-weight: 700;
  margin-bottom: 14px;
  color: #1d4ed8;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}

/* Chips */
.chips-section {
  margin-bottom: 12px;
}

.chips-section h4 {
  font-size: 0.95rem;
  font-weight: 600;
  margin-bottom: 6px;
  color: #374151;
}

.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.chip {
  display: inline-block;
  padding: 5px 12px;
  margin-right: 5px;
  margin-bottom: 5px;
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
  transition: all 0.25s ease;
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
  margin-top: 28px;
  display: flex;
  gap: 14px;
  justify-content: center;
  align-items: center;
}

.page-info {
  padding: 7px 16px;
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

.no-restaurants {
  text-align: center;
  font-size: 1.1rem;
  color: #6b7280;
  margin-top: 30px;
}

.details-btn-container {
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

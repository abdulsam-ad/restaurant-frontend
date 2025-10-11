<template>
  <div class="overview-page">
    <!-- Header -->
    <div class="overview-header">
      <h2 class="clickable-header" @click="loadMetrics">
        📊 Overview
        <span class="refresh-icon" :class="{ spinning: isRefreshing }">🔄</span>
      </h2>
    </div>

    <!-- KPI Cards -->
    <div class="kpi-row">
      <StatsCard
        title="🏢 Total Restaurants"
        :value="totalRestaurants"
        subtitle="Active restaurants"
        color="blue"
      />
      <StatsCard
        title="🛒 Orders Today"
        :value="totalOrdersToday"
        subtitle="Placed today"
        color="green"
      />
      <StatsCard
        title="💰 Revenue Today"
        :value="`$${revenueToday}`"
        subtitle="Gross income"
        color="amber"
      />
      <StatsCard
        title="👥 Active Users"
        :value="activeUsers"
        subtitle="Last 24 hours"
        color="purple"
      />
    </div>

    <!-- Charts and Lists -->
    <div class="charts-row">
      <!-- Orders Trend -->
      <div class="chart-card glass-card">
        <div class="chart-header">
          <h3>📈 Orders Trend (Last 7 Days)</h3>
          <button class="btn-refresh" @click="loadMetrics">🔁 Refresh</button>
        </div>
        <LineChart :labels="ordersLabels" :data="ordersData" label="Orders" />
      </div>

      <!-- Right-side cards -->
      <div class="side-cards">
        <div class="card glass-card">
          <h4>🏠 Latest Restaurants</h4>
          <div class="scroll-table">
            <table class="mini-table">
              <thead>
                <tr><th>Name</th><th>Plan</th><th>Created</th></tr>
              </thead>
              <tbody>
                <tr v-for="r in latestRestaurants" :key="r.id">
                  <td>{{ r.name }}</td>
                  <td>{{ r.plan || '—' }}</td>
                  <td>{{ formatDate(r.created) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="card glass-card">
          <h4>🧾 Recent Orders</h4>
          <div class="scroll-table">
            <table class="mini-table">
              <thead>
                <tr><th>ID</th><th>Restaurant</th><th>Total</th></tr>
              </thead>
              <tbody>
                <tr v-for="o in recentOrders" :key="o.id">
                  <td>#{{ o.id }}</td>
                  <td>{{ o.restaurant }}</td>
                  <td>${{ o.total }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import StatsCard from '../../components/super/StatsCard.vue'
import LineChart from '../../components/super/LineChart.vue'
import { fetchOverviewMetrics } from '../../services/overviews.ts'

const totalRestaurants = ref(0)
const totalOrdersToday = ref(0)
const revenueToday = ref(0)
const activeUsers = ref(0)
const ordersLabels = ref<string[]>([])
const ordersData = ref<number[]>([])
const latestRestaurants = ref<any[]>([])
const recentOrders = ref<any[]>([])
const isRefreshing = ref(false)

function formatDate(dateStr: string) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString()
}

async function loadMetrics() {
  try {
    isRefreshing.value = true
    const data = await fetchOverviewMetrics()
    totalRestaurants.value = data.total_restaurants
    totalOrdersToday.value = data.total_orders_today
    revenueToday.value = data.revenue_today
    activeUsers.value = data.active_users
    ordersLabels.value = data.orders_trend.labels
    ordersData.value = data.orders_trend.data
    latestRestaurants.value = data.latest_restaurants
    recentOrders.value = data.recent_orders
  } catch (err) {
    console.error('Failed to load overview', err)
  } finally {
    setTimeout(() => (isRefreshing.value = false), 600)
  }
}

onMounted(loadMetrics)
</script>

<style scoped>
/* Page Container */
.overview-page {
  padding: 5px;
  background: linear-gradient(135deg, #f9fafb, #f3f4f6);
  min-height: 100vh;
  border-radius: 20px;
  font-family: "Inter", sans-serif;
}

/* Header */
.overview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
}

.clickable-header {
  font-size: 2.2rem;
  font-weight: 800;
  color: #1f2937;
  cursor: pointer;
  transition: transform 0.3s ease, color 0.3s ease;
}

.clickable-header:hover {
  transform: rotate(-1deg) scale(1.05);
  color: #2563eb;
  text-shadow: 0 2px 6px rgba(37, 99, 235, 0.25);
}

.refresh-icon {
  font-size: 1.2rem;
  margin-left: 10px;
  display: inline-block;
  transition: transform 0.6s linear;
}

.refresh-icon.spinning {
  transform: rotate(360deg);
}

/* KPI Cards Grid */
.kpi-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
  gap: 18px;
  margin-bottom: 24px;
}

/* Chart and Side Cards Layout */
.charts-row {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
}

.chart-card {
  flex: 2;
  display: flex;
  flex-direction: column;
  padding: 16px;
}

.side-cards {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* Glass card style */
.glass-card {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(12px);
  border-radius: 16px;
  border: 1px solid rgba(229, 231, 235, 0.6);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.glass-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 22px rgba(0, 0, 0, 0.12);
}

.card h4 {
  font-size: 1rem;
  font-weight: 700;
  margin-bottom: 10px;
  color: #1e3a8a;
}

/* Chart Header */
.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.btn-refresh {
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 6px 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 600;
}

.btn-refresh:hover {
  background: #1d4ed8;
  transform: scale(1.05);
}

/* Tables */
.scroll-table {
  max-height: 220px;
  overflow-y: auto;
}

.mini-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
}

.mini-table th,
.mini-table td {
  padding: 8px;
  border-top: 1px solid #e5e7eb;
}

.mini-table thead th {
  background: #f9fafb;
  font-weight: 600;
  color: #374151;
  position: sticky;
  top: 0;
}

.mini-table tbody tr:hover {
  background: #f3f4f6;
}

/* Smooth Scrollbar */
.scroll-table::-webkit-scrollbar {
  width: 6px;
}
.scroll-table::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 4px;
}
.scroll-table::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}
</style>

<template>
  <div class="dashboard">
    <!-- Header -->
    <h2 class="page-title">📊 Dashboard Overview</h2>

    <!-- Stats Cards -->
    <div class="stats-grid">
      <div class="card" v-for="stat in stats" :key="stat.label">
        <div class="icon">{{ stat.icon }}</div>
        <div class="details">
          <p class="label">{{ stat.label }}</p>
          <h3 class="value">{{ stat.value }}</h3>
        </div>
      </div>
    </div>

    <!-- Recent Orders -->
    <div class="section">
      <h3 class="section-title">🧾 Recent Orders</h3>
      <div class="orders-table">
        <div class="table-header">
          <span>#</span>
          <span>Customer</span>
          <span>Status</span>
          <span>Total</span>
          <span>Date</span>
        </div>
        <div v-for="(order, index) in recentOrders" :key="order.id" class="table-row">
          <span>{{ index + 1 }}</span>
          <span>{{ order.customer }}</span>
          <span>
            <span :class="['status', order.status.toLowerCase()]">{{ order.status }}</span>
          </span>
          <span>${{ order.total.toFixed(2) }}</span>
          <span>{{ order.date }}</span>
        </div>
      </div>
    </div>

    <!-- Sales Chart -->
    <div class="section">
      <h3 class="section-title">📈 Daily Sales</h3>
      <LineChart :chart-data="chartData" :chart-options="chartOptions" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { Line } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from "chart.js";

// Register Chart.js components
ChartJS.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement);

// Local chart component
const LineChart = {
  props: ["chartData", "chartOptions"],
  components: { Line },
  template: `<Line :data="chartData" :options="chartOptions" />`,
};

// Dashboard statistics
const stats = ref([
  { label: "Total Orders", value: 120, icon: "🧾" },
  { label: "Total Revenue", value: "$4,580", icon: "💰" },
  { label: "Active Menu Items", value: 42, icon: "🍔" },
  { label: "Pending Orders", value: 5, icon: "⏳" },
]);

// Sample recent orders
const recentOrders = ref([
  { id: 1, customer: "Ali Khan", status: "Delivered", total: 42.5, date: "Oct 8, 2025" },
  { id: 2, customer: "Sara Ahmed", status: "Pending", total: 15.0, date: "Oct 8, 2025" },
  { id: 3, customer: "John Doe", status: "Preparing", total: 27.99, date: "Oct 7, 2025" },
  { id: 4, customer: "Hassan Raza", status: "Delivered", total: 19.99, date: "Oct 6, 2025" },
  { id: 5, customer: "Ayesha Noor", status: "Cancelled", total: 33.75, date: "Oct 6, 2025" },
]);

// Sample chart data
const chartData = ref({
  labels: ["Oct 1", "Oct 2", "Oct 3", "Oct 4", "Oct 5", "Oct 6", "Oct 7", "Oct 8"],
  datasets: [
    {
      label: "Revenue ($)",
      data: [400, 520, 300, 700, 620, 800, 580, 900],
      borderColor: "#3b82f6",
      backgroundColor: "rgba(59, 130, 246, 0.2)",
      tension: 0.3,
      fill: true,
    },
  ],
});

// Chart options
const chartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: true, position: "top" },
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: { stepSize: 200 },
    },
  },
});
</script>

<style scoped>
.dashboard {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.page-title {
  font-size: 1.8rem;
  font-weight: 700;
  color: #1f2937;
}

/* Stats Cards Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
  gap: 1.2rem;
}

.card {
  background: white;
  border-radius: 0.8rem;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s;
}
.card:hover {
  transform: translateY(-4px);
}

.icon {
  font-size: 2rem;
}

.details .label {
  color: #6b7280;
  font-size: 0.9rem;
}

.details .value {
  font-size: 1.5rem;
  font-weight: bold;
  color: #111827;
}

/* Orders Section */
.section {
  background: white;
  border-radius: 0.8rem;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.section-title {
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.orders-table {
  display: flex;
  flex-direction: column;
}

.table-header,
.table-row {
  display: grid;
  grid-template-columns: 50px 1fr 120px 100px 150px;
  padding: 0.75rem 0.5rem;
  border-bottom: 1px solid #e5e7eb;
  font-size: 0.95rem;
}

.table-header {
  font-weight: bold;
  background: #f9fafb;
}

.table-row:hover {
  background: #f3f4f6;
}

/* Chart Container */
.section :deep(canvas) {
  width: 100%;
  height: 300px !important;
}

/* Status Colors */
.status {
  padding: 4px 10px;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.85rem;
}
.status.delivered {
  background: #dcfce7;
  color: #166534;
}
.status.pending {
  background: #fef9c3;
  color: #854d0e;
}
.status.preparing {
  background: #e0f2fe;
  color: #075985;
}
.status.cancelled {
  background: #fee2e2;
  color: #991b1b;
}
</style>

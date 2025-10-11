<template>
  <div class="chart-wrapper" :class="colorClass">
    <canvas ref="canvasRef"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch, computed } from 'vue'
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

const props = defineProps<{
  labels: string[]
  data: number[]
  label?: string
  color?: 'blue' | 'green' | 'amber' | 'purple'
}>()

const canvasRef = ref<HTMLCanvasElement | null>(null)
let chart: Chart | null = null

const colorConfig = computed(() => {
  switch (props.color) {
    case 'green':
      return {
        border: 'rgba(16,185,129,1)',
        fillStart: 'rgba(16,185,129,0.25)',
        fillEnd: 'rgba(16,185,129,0.02)',
      }
    case 'amber':
      return {
        border: 'rgba(245,158,11,1)',
        fillStart: 'rgba(245,158,11,0.25)',
        fillEnd: 'rgba(245,158,11,0.02)',
      }
    case 'purple':
      return {
        border: 'rgba(139,92,246,1)',
        fillStart: 'rgba(139,92,246,0.25)',
        fillEnd: 'rgba(139,92,246,0.02)',
      }
    default:
      return {
        border: 'rgba(59,130,246,1)',
        fillStart: 'rgba(59,130,246,0.25)',
        fillEnd: 'rgba(59,130,246,0.02)',
      }
  }
})

const colorClass = computed(() => `theme-${props.color ?? 'blue'}`)

onMounted(() => {
  if (!canvasRef.value) return

  const ctx = canvasRef.value.getContext('2d')
  if (!ctx) return

  const gradient = ctx.createLinearGradient(0, 0, 0, 300)
  gradient.addColorStop(0, colorConfig.value.fillStart)
  gradient.addColorStop(1, colorConfig.value.fillEnd)

  chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: props.labels,
      datasets: [
        {
          label: props.label ?? 'Dataset',
          data: props.data,
          fill: true,
          tension: 0.4,
          backgroundColor: gradient,
          borderColor: colorConfig.value.border,
          borderWidth: 2.5,
          pointRadius: 3,
          pointBackgroundColor: colorConfig.value.border,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: colorConfig.value.border,
          pointHoverBorderWidth: 2,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 700, easing: 'easeInOutQuart' },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#111827',
          titleColor: '#fff',
          bodyColor: '#d1d5db',
          cornerRadius: 8,
        },
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { color: '#6b7280', font: { size: 12 } },
        },
        y: {
          grid: { color: 'rgba(243,244,246,0.5)' },
          ticks: { color: '#6b7280', font: { size: 12 } },
        },
      },
    },
  })
})

watch(() => props.data, (newVal) => {
  if (chart && chart.data.datasets[0]) {
    chart.data.datasets[0].data = newVal
    chart.update()
  }
})

watch(() => props.labels, (newVal) => {
  if (chart) {
    chart.data.labels = newVal as any
    chart.update()
  }
})

onBeforeUnmount(() => {
  chart?.destroy()
})
</script>

<style scoped>
.chart-wrapper {
  height: 340px;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 16px;
  padding: 20px;
  backdrop-filter: blur(10px);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
  overflow: hidden;
}

.chart-wrapper:hover {
  transform: translateY(-4px) scale(1.01);
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.1);
}

/* Subtle themed glow */
.theme-blue:hover { box-shadow: 0 0 15px rgba(59,130,246,0.25); }
.theme-green:hover { box-shadow: 0 0 15px rgba(16,185,129,0.25); }
.theme-amber:hover { box-shadow: 0 0 15px rgba(245,158,11,0.25); }
.theme-purple:hover { box-shadow: 0 0 15px rgba(139,92,246,0.25); }
</style>

<template>
  <div
    class="stats-card"
    :class="colorClass"
    @mouseenter="hover = true"
    @mouseleave="hover = false"
  >
    <div class="content">
      <div class="title">{{ title }}</div>
      <div class="value">{{ value }}</div>
      <div class="subtitle" v-if="subtitle">{{ subtitle }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

const props = defineProps<{
  title: string
  value: string | number
  subtitle?: string
  color?: 'blue' | 'green' | 'amber' | 'purple'
}>()

const hover = ref(false)

const colorClass = computed(() => {
  switch (props.color) {
    case 'green': return 'gradient-green'
    case 'amber': return 'gradient-amber'
    case 'purple': return 'gradient-purple'
    default: return 'gradient-blue'
  }
})
</script>

<style scoped>
.stats-card {
  position: relative;
  overflow: hidden;
  border-radius: 16px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  cursor: pointer;
}

/* Hover lift and glow */
.stats-card:hover {
  transform: translateY(-5px) scale(1.02);
  box-shadow: 0 8px 22px rgba(0, 0, 0, 0.12);
}

/* Gradient overlays */
.stats-card::before {
  content: "";
  position: absolute;
  inset: 0;
  opacity: 0.35;
  transition: opacity 0.3s ease;
}
.stats-card:hover::before {
  opacity: 0.5;
}

.gradient-blue::before {
  background: linear-gradient(135deg, #3b82f6, #1e40af);
}
.gradient-green::before {
  background: linear-gradient(135deg, #10b981, #065f46);
}
.gradient-amber::before {
  background: linear-gradient(135deg, #f59e0b, #b45309);
}
.gradient-purple::before {
  background: linear-gradient(135deg, #8b5cf6, #5b21b6);
}

/* Content Layer */
.content {
  position: relative;
  z-index: 1;
  color: #111827;
}

/* Text Styles */
.title {
  font-size: 0.95rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 6px;
}

.value {
  font-size: 1.9rem;
  font-weight: 800;
  color: #111827;
  letter-spacing: -0.5px;
  margin-bottom: 4px;
}

.subtitle {
  font-size: 0.85rem;
  color: #4b5563;
}

/* Responsive */
@media (max-width: 640px) {
  .value {
    font-size: 1.6rem;
  }
  .title {
    font-size: 0.9rem;
  }
}
</style>

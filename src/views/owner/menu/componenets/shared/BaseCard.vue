<template>
  <div 
    class="base-card" 
    :class="computedClasses"
    :style="{ '--card-padding': padding }"
  >
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  variant?: 'default' | 'light' | 'compact'
  padding?: string
  hover?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  padding: '20px',
  hover: true
})

const computedClasses = computed(() => ({
  'card-light': props.variant === 'light',
  'card-compact': props.variant === 'compact',
  'card-hover': props.hover
}))
</script>

<style scoped>
.base-card {
  background: #fff;
  border-radius: 16px;
  padding: var(--card-padding, 20px);
  box-shadow: 0 6px 18px rgba(12, 24, 48, 0.06);
  transition: all 0.25s ease;
}

.card-light {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
}

.card-hover:hover {
  box-shadow: 0 8px 24px rgba(12, 24, 48, 0.08);
  transform: translateY(-2px);
}
</style>
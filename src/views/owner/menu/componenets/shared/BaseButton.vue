<template>
  <button 
    :class="['base-button', `button-${variant}`, { 'button-disabled': disabled }]"
    :disabled="disabled"
    @click="$emit('click', $event)"
  >
    <slot></slot>
  </button>
</template>

<script setup lang="ts">
interface Props {
  variant?: 'primary' | 'secondary' | 'success' | 'danger';
  disabled?: boolean;
}

interface Emits {
  (e: 'click', event: MouseEvent): void;
}

withDefaults(defineProps<Props>(), {
  variant: 'primary',
  disabled: false
})

defineEmits<Emits>()
</script>

<style scoped>
/* Same styles as before */
.base-button {
  padding: 10px 14px;
  border-radius: 10px;
  border: none;
  font-weight: 700;
  cursor: pointer;
  min-width: 90px;
  transition: transform 0.15s, box-shadow 0.15s;
}

.base-button:hover:not(.button-disabled) {
  transform: translateY(-1px);
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.08);
}

.button-primary { 
  background: linear-gradient(180deg,#2563eb,#1e40af); 
  color: #fff; 
  box-shadow: 0 8px 20px rgba(37,99,235,0.12); 
}

.button-secondary { 
  background: linear-gradient(180deg,#f3f4f6,#e6eef6); 
  color:#0b1220; 
  border: 1px solid #e6eef6; 
}

.button-success { 
  background: linear-gradient(180deg,#10b981,#059669);
  color:#fff; 
}

.button-danger { 
  background: linear-gradient(180deg,#ef4444,#dc2626);
  color:#fff; 
}

.button-disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none !important;
}
</style>
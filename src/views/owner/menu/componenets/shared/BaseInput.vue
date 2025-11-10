<template>
  <div class="form-field">
    <label v-if="label" class="field-label">{{ label }}</label>
    <input
      :value="modelValue"
      :type="type"
      :placeholder="placeholder"
      :class="['base-input', { 'input-error': error }]"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
    <small v-if="error" class="error-message">{{ error }}</small>
  </div>
</template>

<script setup lang="ts">
interface Props {
  modelValue: string | number;
  label?: string;
  type?: string;
  placeholder?: string;
  error?: string;
}

interface Emits {
  (e: 'update:modelValue', value: string): void;
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  placeholder: '',
  error: ''
})

const emit = defineEmits<Emits>()
</script>

<style scoped>
/* Same styles as before */
.form-field {
  margin-bottom: 14px;
  display: flex;
  flex-direction: column;
}

.field-label {
  font-size: 13px;
  color: #475569;
  margin-bottom: 6px;
  font-weight: 500;
}

.base-input {
  padding: 12px 14px;
  border-radius: 14px;
  border: 1px solid #d1d5db;
  background: #f9fafb;
  font-size: 15px;
  font-family: inherit;
  color: #1f2937;
  box-shadow: inset 2px 2px 4px rgba(0, 0, 0, 0.05),
              inset -2px -2px 4px rgba(255, 255, 255, 0.7);
  transition: all 0.25s ease;
}

.base-input:hover {
  background: #ffffff;
  border-color: #cbd5e1;
}

.base-input:focus {
  outline: none;
  border-color: #2563eb;
  background: #fff;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.2);
}

.input-error {
  border-color: #ef4444;
}

.error-message {
  color: #ef4444;
  font-size: 12px;
  margin-top: 4px;
}
</style>
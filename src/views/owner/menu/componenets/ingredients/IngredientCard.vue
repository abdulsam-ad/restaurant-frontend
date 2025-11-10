<template>
  <div class="ingredient-card">
    <div class="card-top">
      <h3>{{ ingredient.name }}</h3>
      <div v-if="showActions" class="card-actions">
        <button class="icon" title="Edit" @click.stop="$emit('edit')">✏️</button>
        <button class="icon danger" title="Delete" @click.stop="$emit('remove')">🗑️</button>
      </div>
    </div>

    <img 
      v-if="ingredient.preview" 
      alt="Ingredient Image" 
      :src="ingredient.preview" 
      class="card-image" 
    />
    <p class="muted">{{ ingredient.description || "No description" }}</p>
    <div class="meta">
      <span class="quantity">{{ formatQuantity(ingredient.quantity) }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { LocalIngredient } from '../types/menu'

interface Props {
  ingredient: LocalIngredient
  showActions?: boolean
}

interface Emits {
  (e: 'edit'): void
  (e: 'remove'): void
}

withDefaults(defineProps<Props>(), {
  showActions: false
})

defineEmits<Emits>()

const formatQuantity = (quantity: number | null): string => {
  if (quantity === null || quantity === undefined) return "Quantity N/A"
  return `Qty: ${Number(quantity).toFixed(0)}`
}
</script>

<style scoped>
.ingredient-card {
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s, box-shadow 0.2s;
}

.ingredient-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.card-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 8px;
}

.card-top h3 {
  margin: 0;
  font-size: 14px;
  color: #111827;
  font-weight: 600;
  line-height: 1.2;
}

.card-actions {
  display: flex;
  gap: 4px;
  flex-shrink: 0;
}

.icon {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 14px;
  padding: 4px;
  border-radius: 4px;
  transition: background 0.2s;
  line-height: 1;
}

.icon:hover {
  background: #f1f5f9;
}

.icon.danger {
  color: #dc2626;
}

.card-image {
  width: 100%;
  height: 100px;
  object-fit: cover;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

.muted {
  color: #6b7280;
  font-size: 12px;
  margin: 0;
  line-height: 1.3;
}

.meta {
  display: flex;
  justify-content: space-between;
  color: #374151;
  font-size: 12px;
}

.quantity {
  font-weight: 600;
  color: #059669;
}
</style>
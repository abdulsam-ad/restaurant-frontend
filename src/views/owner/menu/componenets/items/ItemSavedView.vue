<template>
  <BaseCard class="saved-view compact-saved">
    <div class="menu-header">
      <h2 class="menu-saved-title">✅ Item Saved</h2>
    </div>

    <div class="menu-details compact-details">
      <div
        class="detail-item compact-item editable"
        @click="$emit('edit-item')"
        title="Click to edit name"
      >
        <span class="detail-label">📘 Name:</span>
        <span class="detail-value">{{ item.name }}</span>
      </div>

      <div
        class="detail-item compact-item editable"
        @click="$emit('edit-item')"
        title="Click to edit description"
      >
        <span class="detail-label">📝 Description:</span>
        <span class="detail-value">
          {{ item.description || 'No description provided' }}
        </span>
      </div>
    </div>

    <!-- Ingredient List -->
    <IngredientList
      v-if="ingredients.length"
      :ingredients="ingredients"
      @edit-ingredient="$emit('edit-ingredient', $event)"
      @remove-ingredient="$emit('remove-ingredient', $event)"
    />

    <div v-if="ingredients.length" class="last-button-actions">
      <BaseButton variant="success" @click="$emit('create-item')">
        💾 Create Item
      </BaseButton>
    </div>
  </BaseCard>
</template>

<script setup lang="ts">
import BaseCard from '../shared/BaseCard.vue'
import BaseButton from '../shared/BaseButton.vue'
import IngredientList from '../ingredients/IngredientList.vue'
import type { ItemForm, LocalIngredient } from '../types/menu'

interface Props {
  item: ItemForm
  ingredients: LocalIngredient[]
}

interface Emits {
  (e: 'edit-item'): void
  (e: 'create-item'): void
  (e: 'edit-ingredient', index: number): void
  (e: 'remove-ingredient', index: number): void
}

defineProps<Props>()
defineEmits<Emits>()
</script>

<style scoped>
.saved-view {
  background: #f9fafb;
  border: 1px solid #e5e7eb;
}

.menu-header {
  text-align: left;
  margin-bottom: 4px;
}

.menu-saved-title {
  font-size: 1.1rem;
  color: #059669;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 6px;
}

.compact-details {
  display: flex;
  flex-wrap: wrap;
  gap: 10px 20px;
  font-size: 14px;
  color: #374151;
}

.compact-item {
  display: flex;
  align-items: center;
  gap: 4px;
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 6px 10px;
  cursor: pointer;
  transition: background 0.2s, box-shadow 0.2s;
}

.compact-item:hover {
  background: #f0f9ff;
  box-shadow: 0 2px 6px rgba(37, 99, 235, 0.08);
}

.detail-label {
  font-weight: 600;
  color: #475569;
}

.detail-value {
  color: #111827;
}

.last-button-actions {
  margin-top: 12px;
  display: flex;
  justify-content: center;
  gap: 8px;
  align-items: center;
}
</style>
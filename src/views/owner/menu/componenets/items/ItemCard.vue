<template>
  <div class="menu-item-card" @click="$emit('edit')">
    <div class="card-content">
      <img
        v-if="item.preview"
        :src="item.preview"
        alt="Item Image"
        class="item-image"
      />
      <div class="item-info">
        <h4>{{ item.name }}</h4>
        <p>{{ item.description || 'No description provided' }}</p>
        <p class="price">{{ formatPrice(item.price) }}</p>
        <p class="category">{{ getCategoryName(item.category) }}</p>
      </div>
    </div>

    <!-- Ingredient List -->
    <div v-if="item.ingredients.length">
      <h2 class="filed full">Ingredients Added</h2>
      <div class="ingredient-cards">
        <IngredientCard
          v-for="ingredient in item.ingredients"
          :key="ingredient._localId"
          :ingredient="ingredient"
          :show-actions="false"
        />
      </div>
    </div>

    <div class="card-actions">
      <BaseButton variant="danger" @click.stop="$emit('remove')">
        🗑️ Delete
      </BaseButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import BaseButton from '../shared/BaseButton.vue'
import IngredientCard from '../ingredients/IngredientCard.vue'
import type { LocalItem } from '../types/menu'

interface Props {
  item: LocalItem
  getCategoryName: (categoryId: string | number | null) => string
}

interface Emits {
  (e: 'edit'): void
  (e: 'remove'): void
}

defineProps<Props>()
defineEmits<Emits>()

const formatPrice = (price: number | null): string => {
  if (price === null || price === undefined) return "N/A"
  return `$${Number(price).toFixed(2)}`
}
</script>

<style scoped>
.menu-item-card {
  background: #ffffff;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  padding: 16px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  cursor: pointer;
}

.menu-item-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
}

.card-content {
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
}

.item-image {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  object-fit: cover;
  border: 1px solid #e5e7eb;
}

.item-info {
  flex: 1;
}

.item-info h4 {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 4px;
}

.item-info p {
  color: #4b5563;
  font-size: 13px;
  margin-bottom: 3px;
}

.price {
  color: #2563eb;
  font-weight: 600;
}

.category {
  color: #6b7280;
  font-size: 12px;
}

.filed.full {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  margin: 12px 0 8px 0;
}

.ingredient-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 8px;
  margin-bottom: 12px;
}

.card-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}
</style>
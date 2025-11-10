<template>
  <div class="ingredient-list">
    <h2 class="section-title">Ingredients Added</h2>
    <div class="ingredient-cards">
      <IngredientCard
        v-for="(ingredient, index) in ingredients"
        :key="ingredient._localId"
        :ingredient="ingredient"
        :show-actions="true"
        @edit="$emit('edit-ingredient', index)"
        @remove="$emit('remove-ingredient', index)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import IngredientCard from './IngredientCard.vue'
import type { LocalIngredient } from '../types/menu'

interface Props {
  ingredients: LocalIngredient[]
}

interface Emits {
  (e: 'edit-ingredient', index: number): void
  (e: 'remove-ingredient', index: number): void
}

defineProps<Props>()
defineEmits<Emits>()
</script>

<style scoped>
.ingredient-list {
  margin-top: 16px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 12px;
}

.ingredient-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 12px;
}
</style>
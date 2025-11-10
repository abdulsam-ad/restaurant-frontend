<template>
  <BaseCard class="ingredients-section" variant="light">
    <h3>Add Ingredients</h3>
    <div v-if="!addingIngredient" class="last-button-actions">
      <BaseButton variant="secondary" @click="$emit('cancel')">
        ↩ Cancel
      </BaseButton>
      <BaseButton variant="primary" @click="$emit('toggle-add-ingredient')">
        ➕ Add Ingredient
      </BaseButton>
    </div>

    <div v-if="addingIngredient" class="form-grid">
      <BaseInput
        v-model="ingredientForm.name"
        label="Ingredient Name"
        placeholder="e.g. Tomato"
      />

      <BaseInput
        v-model="ingredientForm.quantity"
        label="Ingredient Quantity"
        placeholder="5"
      />

      <BaseTextarea
        v-model="ingredientForm.description"
        label="Ingredient Description"
        placeholder="Short description (optional)"
        class="full"
      />

      <div class="field">
        <label class="field-label">Ingredient Image</label>
        <input
          type="file"
          accept="image/*"
          @change="$emit('image-change', $event)"
          class="form-input"
        />
        <small v-if="imagePreview">Preview:</small>
        <img
          v-if="imagePreview"
          alt="Preview Image"
          :src="imagePreview"
          class="preview"
        />
      </div>
    </div>

    <div v-if="addingIngredient" class="last-button-actions">
      <BaseButton variant="secondary" @click="$emit('cancel')">
        ↩ Cancel
      </BaseButton>
      <BaseButton variant="success" @click="$emit('save-ingredient')">
        💾 Save Ingredient
      </BaseButton>
    </div>
  </BaseCard>
</template>

<script setup lang="ts">
import BaseCard from '../shared/BaseCard.vue'
import BaseInput from '../shared/BaseInput.vue'
import BaseTextarea from '../shared/BaseTextarea.vue'
import BaseButton from '../shared/BaseButton.vue'
import type { IngredientForm } from '../types/menu'

interface Props {
  ingredientForm: IngredientForm
  addingIngredient: boolean
  imagePreview: string | null
}

interface Emits {
  (e: 'toggle-add-ingredient'): void
  (e: 'save-ingredient'): void
  (e: 'image-change', event: Event): void
  (e: 'cancel'): void
}

defineProps<Props>()
defineEmits<Emits>()
</script>

<style scoped>
.ingredients-section {
  margin-top: 12px;
  background: #f8fafc;
  border-radius: 12px;
  padding: 16px;
  border: 1px solid #e2e8f0;
  margin-bottom: 20px;
}

.ingredients-section h3 {
  margin-bottom: 1rem;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 12px;
  align-items: start;
}

.form-grid .full {
  grid-column: 1 / -1;
}

.field {
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

.form-input {
  width: 100%;
  border: 1px solid #d1d5db;
  border-radius: 10px;
  padding: 10px 12px;
  background: #f9fafb;
  font-size: 14px;
  color: #111827;
  box-sizing: border-box;
  transition: all 0.25s ease;
}

.form-input:focus {
  outline: none;
  border-color: #2563eb;
  background: #fff;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.2);
}

.preview {
  display: block;
  width: 100px;
  height: 80px;
  object-fit: cover;
  margin-top: 8px;
  border-radius: 10px;
  border: 1px solid #e6e8eb;
}

.last-button-actions {
  margin-top: 12px;
  display: flex;
  justify-content: center;
  gap: 8px;
  align-items: center;
}
</style>
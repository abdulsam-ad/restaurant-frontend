<template>
  <BaseCard class="items-section">
    <h2>Add Menu Items</h2>

    <!-- Unsaved / Input Mode -->
    <div v-if="!addingItem" class="last-button-actions">
      <BaseButton variant="secondary" @click="$emit('cancel')">
        ↩ Cancel
      </BaseButton>
      <BaseButton variant="primary" @click="$emit('toggle-add-item')">
        ➕ Add Item
      </BaseButton>
    </div>

    <div v-if="addingItem">
      <div class="form-grid">
        <BaseInput
          v-model="itemForm.name"
          label="Item Name"
          placeholder="e.g. French Fries"
        />

        <BaseInput
          v-model="itemForm.price"
          type="number"
          label="Item Price"
          placeholder="0.00"
        />

        <div class="field">
          <label class="field-label">Item Category</label>
          <select v-model="itemForm.category" class="form-input">
            <option disabled value="">Select category</option>
            <option v-for="cat in categories" :key="cat.id" :value="cat.id">
              {{ cat.name }}
            </option>
          </select>
        </div>

        <BaseTextarea
          v-model="itemForm.description"
          label="Item Description"
          placeholder="Short description (optional)"
          class="full"
        />

        <div class="field">
          <label class="field-label">Item Image</label>
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

      <div class="last-button-actions">
        <BaseButton variant="secondary" @click="$emit('toggle-add-item')">
          ↩ Cancel
        </BaseButton>
        <BaseButton variant="success" @click="$emit('save-item')">
          💾 Save Item
        </BaseButton>
      </div>
    </div>
  </BaseCard>
</template>

<script setup lang="ts">
import BaseCard from '../shared/BaseCard.vue'
import BaseInput from '../shared/BaseInput.vue'
import BaseTextarea from '../shared/BaseTextarea.vue'
import BaseButton from '../shared/BaseButton.vue'
import type { ItemForm, Category } from '../types/menu'

interface Props {
  itemForm: ItemForm
  categories: Category[]
  imagePreview: string | null
  addingItem: boolean
}

interface Emits {
  (e: 'toggle-add-item'): void
  (e: 'save-item'): void
  (e: 'image-change', event: Event): void
  (e: 'cancel'): void
}

defineProps<Props>()
defineEmits<Emits>()
</script>

<style scoped>
.items-section h2 {
  margin-bottom: 1.5rem;
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
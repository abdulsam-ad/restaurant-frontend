<template>
  <BaseCard class="saved-view compact-saved">
    <div class="menu-header">
      <h2 class="menu-saved-title">✅ Menu Saved</h2>
    </div>

    <div class="menu-details compact-details">
      <div
        class="detail-item compact-item editable"
        @click="$emit('edit-menu')"
        title="Click to edit name"
      >
        <span class="detail-label">📘 Name:</span>
        <span class="detail-value">{{ menu.name }}</span>
      </div>

      <div
        class="detail-item compact-item editable"
        @click="$emit('edit-menu')"
        title="Click to edit description"
      >
        <span class="detail-label">📝 Description:</span>
        <span class="detail-value">
          {{ menu.description || 'No description provided' }}
        </span>
      </div>
    </div>

    <!-- Added Item Cards -->
    <div v-if="items.length" class="menu-item-list">
      <h3 class="section-title">Items Added</h3>

      <div class="menu-item-cards">
        <MenuItemCard
          v-for="(item, index) in items"
          :key="item._localId"
          :item="item"
          :get-category-name="getCategoryName"
          @edit="() => $emit('edit-item', index)"
          @remove="() => $emit('remove-item', index)"
        />
      </div>
    </div>
  </BaseCard>
</template>

<script setup lang="ts">
import BaseCard from '../shared/BaseCard.vue'
import MenuItemCard from '../items/ItemCard.vue'
import type { MenuForm, LocalItem } from '../types/menu'

interface Props {
  menu: MenuForm
  items: LocalItem[]
  getCategoryName: (categoryId: string | number | null) => string
}

interface Emits {
  (e: 'edit-menu'): void
  (e: 'edit-item', index: number): void
  (e: 'remove-item', index: number): void
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

.menu-item-list {
  margin-top: 30px;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #111827;
  margin-bottom: 12px;
}

.menu-item-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
}
</style>
<template>
  <BaseCard class="menu-top">
    <h1 class="menu-title">Create New Menu</h1>

    <div class="field">
      <BaseInput
        v-model="menuForm.name"
        label="Menu Name"
        placeholder="e.g. Lunch Specials"
        :error="nameError"
      />
    </div>

    <div class="field">
      <BaseTextarea
        v-model="menuForm.description"
        label="Menu Description"
        placeholder="Short description (optional)"
      />
    </div>

    <div class="last-button-actions">
      <BaseButton variant="secondary" @click="$emit('cancel')">
        ↩ Cancel
      </BaseButton>
      <BaseButton
        variant="success"
        @click="$emit('save')"
        :disabled="saving"
      >
        <span v-if="saving">⏳ Saving...</span>
        <span v-else>💾 Save Menu</span>
      </BaseButton>
    </div>
  </BaseCard>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import BaseCard from '../shared/BaseCard.vue'
import BaseInput from '../shared/BaseInput.vue'
import BaseTextarea from '../shared/BaseTextarea.vue'
import BaseButton from '../shared/BaseButton.vue'
import { MenuForm } from '../../types/menu'

interface Props {
  menuForm: MenuForm
  saving: boolean
}

interface Emits {
  (e: 'save'): void
  (e: 'cancel'): void
}

defineProps<Props>()
defineEmits<Emits>()

const nameError = computed(() => {
  // You can add validation logic here if needed
  return ''
})
</script>

<style scoped>
.menu-title {
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
}

.last-button-actions {
  margin-top: 12px;
  display: flex;
  justify-content: center;
  gap: 8px;
  align-items: center;
}
</style>
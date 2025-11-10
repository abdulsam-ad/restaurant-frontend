<template>
  <div class="create-menu-page">
    <!-- Menu Section -->
    <MenuForm 
      v-if="!menuSaved" 
      :menu-form="menuForm"
      :saving="savingMenu"
      @save="handleSaveMenu"
      @cancel="cancelCreate"
    />

    <MenuSavedView 
      v-else
      :menu="menuForm"
      :items="items"
      :get-category-name="getCategoryName"
      @edit-menu="menuSaved = false"
      @edit-item="handleEditItem"
      @remove-item="handleRemoveItem"
    />

    <!-- Item Section -->
    <ItemForm 
      v-if="menuSaved && !itemSaved"
      :item-form="itemForm"
      :categories="categories"
      :image-preview="itemImagePreview"
      :adding-item="addingItem"
      @toggle-add-item="addingItem = !addingItem"
      @save-item="handleSaveItem"
      @image-change="onItemImageChange"
      @cancel="menuSaved = false"
    />

    <ItemSavedView 
      v-if="itemSaved"
      :item="itemForm"
      :ingredients="currentIngredients"
      @edit-item="itemSaved = false"
      @create-item="handleCreateItem"
      @edit-ingredient="handleEditIngredient"
      @remove-ingredient="handleRemoveIngredient"
    />

    <!-- Ingredient Section -->
    <IngredientForm 
      v-if="itemSaved"
      :ingredient-form="ingredientForm"
      :adding-ingredient="addingIngredient"
      :image-preview="ingredientImagePreview"
      @toggle-add-ingredient="addingIngredient = !addingIngredient"
      @save-ingredient="handleSaveIngredient"
      @image-change="onIngredientImageChange"
      @cancel="itemSaved = false"
    />

    <!-- Final Submit -->
    <div v-if="showFinalSubmit" class="last-button-actions">
      <BaseButton 
        variant="success" 
        :disabled="submitting"
        @click="submitAll"
      >
        <span v-if="submitting">⏳ Submitting...</span>
        <span v-else>💾 Create Menu</span>
      </BaseButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'

// Composables
import { useMenuBuilder } from './componenets/composables/useMenuBuilder'
import { useItemBuilder } from './componenets/composables/useItemBuilder'
import { useIngredientBuilder } from './componenets/composables/useIngredientBuilder'
import { useImageUpload } from './componenets/composables/useImageUpload'
import { useCategories } from './componenets/composables/useCategories'

// Components
import MenuForm from './componenets/menu/MenuForm.vue'
import MenuSavedView from './componenets/menu/MenuSavedView.vue'
import ItemForm from './componenets/items/ItemForm.vue'
import ItemSavedView from './componenets/items/ItemSavedView.vue'
import IngredientForm from './componenets/ingredients/IngredientForm.vue'
import BaseButton from './componenets/shared/BaseButton.vue'

// Services & Stores
import { selectedRestaurantId } from '../../../stores/restaurantState'
import { createFullMenu } from '../../../services/owner/menu'

const router = useRouter()
const toast = useToast()

// Composables
const {
  menuForm,
  menuSaved,
  savingMenu,
  saveMenu: saveMenuComposable
} = useMenuBuilder(selectedRestaurantId)

const { 
  itemForm, 
  items, 
  itemSaved, 
  addingItem, 
  saveItem: saveItemComposable,
  editItem,
  removeItem,
  resetItemForm 
} = useItemBuilder(selectedRestaurantId)

const {
  ingredientForm,
  currentIngredients,
  addingIngredient,
  saveIngredient: saveIngredientComposable,
  editIngredient,
  removeIngredient,
  clearIngredientForm
} = useIngredientBuilder()

const { 
  imagePreview: itemImagePreview, 
  handleImageChange: handleItemImageChange 
} = useImageUpload()

const { 
  imagePreview: ingredientImagePreview, 
  handleImageChange: handleIngredientImageChange 
} = useImageUpload()

const { categories, loadCategories, getCategoryName } = useCategories(selectedRestaurantId)

// Local state
const submitting = ref<boolean>(false)
const itemCreated = ref<boolean>(false)

// Computed
const showFinalSubmit = computed((): boolean => {
  return menuSaved.value && itemCreated.value && !itemSaved.value && !addingItem.value
})

// Methods
async function handleSaveMenu(): Promise<void> {
  const success = await saveMenuComposable()
  if (success) {
    addingItem.value = true
  }
}

function handleSaveItem(): void {
  // const success = saveItemComposable(currentIngredients.value)
  // if (!success) {
  //   itemSaved.value = false
  // }
  itemSaved.value = true
}

function handleSaveIngredient(): void {
  saveIngredientComposable(ingredientImagePreview.value)
}

function handleCreateItem(): void {
  // This will trigger the item to be added to items list
  const success = saveItemComposable(currentIngredients.value)
  if (success) {
    resetItemForm()
    currentIngredients.value = []
    itemSaved.value = false
    itemCreated.value = true
    addingItem.value = false
    ingredientImagePreview.value = null
  }
}

function handleEditItem(index: number): void {
  editItem(index)
  itemSaved.value = false
  addingItem.value = true
}

function handleRemoveItem(index: number): void {
  removeItem(index)
}

function handleEditIngredient(index: number): void {
  const preview = editIngredient(index)
  if (preview) {
    ingredientImagePreview.value = preview
  }
  addingIngredient.value = true
}

function handleRemoveIngredient(index: number): void {
  removeIngredient(index)
}

function onItemImageChange(event: Event): void {
  handleItemImageChange(event, itemForm, itemImagePreview)
}

function onIngredientImageChange(event: Event): void {
  handleIngredientImageChange(event, ingredientForm, ingredientImagePreview)
}

async function submitAll(): Promise<void> {
  if (submitting.value) return
  
  if (!menuForm.name?.trim()) {
    toast.error("Menu name is required.")
    return
  }

  if (items.value.length === 0) {
    toast.error("Add at least one menu item.")
    return
  }

  if (!selectedRestaurantId.value) {
    toast.error("Restaurant ID is required.")
    return
  }

  submitting.value = true
  try {
    const formData = buildFormData()
    const response = await createFullMenu(formData)
    
    toast.success("Menu created successfully!")
    
    if (response?.data?.id) {
      await router.push(`/owner/menu-detail/${response.data.id}`)
    }
  } catch (error) {
    console.error("Submit failed:", error)
    toast.error("Failed to create menu. Please try again.")
  } finally {
    submitting.value = false
  }
}

function buildFormData(): FormData {
  const formData = new FormData()
  
  // Menu data
  formData.append("name", menuForm.name)
  formData.append("restaurant", String(selectedRestaurantId.value))
  formData.append("description", menuForm.description || "")

  // Items data
  items.value.forEach((item, index: number) => {
    const prefix = `items[${index}]`
    formData.append(`${prefix}[name]`, item.name)
    formData.append(`${prefix}[description]`, item.description || "")
    formData.append(`${prefix}[price]`, String(item.price || ""))
    formData.append(`${prefix}[restaurant]`, String(selectedRestaurantId.value))

    if (item.category) {
      formData.append(`${prefix}[category]`, String(item.category))
    }

    // Item ingredients
    item.ingredients.forEach((ingredient, ingIndex: number) => {
      const ingPrefix = `${prefix}[ingredients][${ingIndex}]`
      formData.append(`${ingPrefix}[name]`, ingredient.name)
      formData.append(`${ingPrefix}[quantity]`, String(ingredient.quantity || ""))
      formData.append(`${ingPrefix}[description]`, ingredient.description || "")
    })

    // Item image
    if (item.file) {
      formData.append(`${prefix}[image]`, item.file, item.file.name)
    }
  })

  return formData
}

async function cancelCreate(): Promise<void> {
  await router.push('/owner/menu')
}

// Lifecycle
onMounted(() => {
  if (selectedRestaurantId.value) {
    loadCategories()
  }
})
</script>

<style scoped>
.create-menu-page {
  max-width: 1000px;
  margin: 20px auto;
  display: grid;
  gap: 20px;
  font-family: Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
  padding: 12px;
}

.last-button-actions {
  margin-top: 12px;
  display: flex;
  justify-content: center;
  gap: 8px;
  align-items: center;
}

@media (max-width: 700px) {
  .create-menu-page {
    padding: 8px;
  }
}
</style>
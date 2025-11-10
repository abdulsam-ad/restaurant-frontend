import { ref, reactive } from 'vue'
import type { Ref } from 'vue'
import { useToast } from 'vue-toastification'
import type { ItemForm, LocalItem, LocalIngredient } from '../types/menu'

export function useItemBuilder(restaurantId: Ref<number | null>) {
  const toast = useToast()
  
  const itemForm: ItemForm = reactive({
    name: "",
    restaurant: restaurantId.value,
    description: "",
    price: null,
    category: "",
    file: null,
  })

  const items = ref<LocalItem[]>([])
  const itemSaved = ref<boolean>(false)
  const addingItem = ref<boolean>(false)
  const editingIndex = ref<number>(-1)
  let localCounter = 0

  function validateItem(item: ItemForm): boolean {
    if (!item.name?.trim()) {
      toast.error("Item name is required.")
      return false
    }
    
    if (item.price === null || item.price === undefined || item.price < 0) {
      toast.error("Valid item price is required.")
      return false
    }

    // Check for duplicates
    const newName = item.name.trim().toLowerCase()
    const duplicate = items.value.some((existingItem, idx) => {
      const existingName = existingItem.name?.toLowerCase().trim()
      return existingName === newName && idx !== editingIndex.value
    })

    if (duplicate) {
      toast.error("An item with this name already exists.")
      return false
    }

    return true
  }

    
    function saveItem(currentIngredients: LocalIngredient[] = []): boolean {
        if (!validateItem(itemForm)) return false

        if (currentIngredients.length === 0) {
            toast.error("Please add at least one ingredient.")
            return false
        }

        const localItem: LocalItem = {
            name: itemForm.name.trim(),
            description: itemForm.description?.trim() || "",
            price: Number(itemForm.price),
            category: itemForm.category || null,
            file: itemForm.file,
            preview: (itemForm as any).preview || null, // Add this line
            ingredients: [...currentIngredients],
            _localId: ++localCounter,
        }

        if (editingIndex.value >= 0) {
            items.value[editingIndex.value] = localItem
            toast.success("Item updated.")
        } else {
            items.value.push(localItem)
            toast.success("Item added.")
        }

        itemSaved.value = true
        return true
    }

  function editItem(index: number): void {
    const item = items.value[index]
    if (!item) {
      toast.error("Item not found.")
      return
    }
    Object.assign(itemForm, {
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category,
      file: item.file,
      preview: item.preview,
    })
    editingIndex.value = index
  }

  function removeItem(index: number): void {
    if (!confirm("Remove this item from the list?")) return
    items.value.splice(index, 1)
    toast.info("Item removed.")
  }

  function resetItemForm(): void {
    Object.assign(itemForm, {
      name: "",
      description: "",
      price: null,
      category: "",
      file: null,
      preview: null,
    })
    editingIndex.value = -1
  }

  return {
    itemForm,
    items,
    itemSaved,
    addingItem,
    editingIndex,
    saveItem,
    editItem,
    removeItem,
    resetItemForm
  }
}
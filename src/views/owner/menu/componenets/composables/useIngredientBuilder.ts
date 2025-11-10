import { ref, reactive } from 'vue'
// import type { Ref } from 'vue'
import { useToast } from 'vue-toastification'
import type { IngredientForm, LocalIngredient } from '../types/menu'

export function useIngredientBuilder() {
  const toast = useToast()
  
  const ingredientForm: IngredientForm = reactive({
    name: "",
    description: "",
    quantity: null,
    file: null,
  })

  const currentIngredients = ref<LocalIngredient[]>([])
  const addingIngredient = ref<boolean>(false)
  const editingIngredientIndex = ref<number>(-1)
  let localIngredientsCounter = 0

  function validateIngredient(ingredient: IngredientForm): boolean {
    if (!ingredient.name?.trim()) {
      toast.error("Ingredient name is required.")
      return false
    }
    
    if (!ingredient.quantity || ingredient.quantity <= 0) {
      toast.error("Valid ingredient quantity is required.")
      return false
    }

    // Check for duplicates
    const newName = ingredient.name.trim().toLowerCase()
    const duplicate = currentIngredients.value.some((existingIng, idx) => {
      const existingName = existingIng.name?.toLowerCase().trim()
      return existingName === newName && idx !== editingIngredientIndex.value
    })

    if (duplicate) {
      toast.error("An ingredient with this name already exists.")
      return false
    }

    return true
  }

  function saveIngredient(imagePreview: string | null = null): boolean {
    if (!validateIngredient(ingredientForm)) return false

    const localIngredient: LocalIngredient = {
      name: ingredientForm.name.trim(),
      quantity: Number(ingredientForm.quantity),
      description: ingredientForm.description?.trim() || "",
      file: ingredientForm.file,
      preview: imagePreview,
      _localId: ++localIngredientsCounter,
    }

    if (editingIngredientIndex.value >= 0) {
      currentIngredients.value[editingIngredientIndex.value] = localIngredient
      toast.success("Ingredient updated.")
    } else {
      currentIngredients.value.push(localIngredient)
      toast.success("Ingredient added.")
    }

    clearIngredientForm()
    addingIngredient.value = false
    return true
  }

  function editIngredient(index: number): string | null {
    const ingredient = currentIngredients.value[index]
    Object.assign(ingredientForm, {
      name: ingredient.name,
      description: ingredient.description,
      quantity: ingredient.quantity,
      file: ingredient.file,
    })
    editingIngredientIndex.value = index
    return ingredient.preview
  }

  function removeIngredient(index: number): void {
    currentIngredients.value.splice(index, 1)
    toast.info("Ingredient removed.")
  }

  function clearIngredientForm(): void {
    Object.assign(ingredientForm, {
      name: "",
      description: "",
      quantity: null,
      file: null,
    })
    editingIngredientIndex.value = -1
  }

  return {
    ingredientForm,
    currentIngredients,
    addingIngredient,
    editingIngredientIndex,
    saveIngredient,
    editIngredient,
    removeIngredient,
    clearIngredientForm
  }
}
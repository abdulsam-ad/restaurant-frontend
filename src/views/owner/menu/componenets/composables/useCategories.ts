import { ref, watch } from 'vue'
import type { Ref } from 'vue'
import { useToast } from 'vue-toastification'
import type { Category } from '../types/menu'
import { fetchCategories } from '../../../../../services/owner/category'

export function useCategories(restaurantId: Ref<number | null>) {
  const toast = useToast()
  const categories = ref<Category[]>([])
  const loading = ref<boolean>(false)

  async function loadCategories(): Promise<void> {
    if (!restaurantId.value) {
      toast.error("Please select a restaurant")
      return
    }

    loading.value = true
    try {
      const data = await fetchCategories(restaurantId.value)
      categories.value = data.results || []
    } catch (err) {
      console.error("Failed to load categories", err)
      toast.error("Failed to load categories")
    } finally {
      loading.value = false
    }
  }

  function getCategoryName(categoryId: string | number | null): string {
    if (!categoryId) return "Uncategorized"
    const category = categories.value.find(cat => String(cat.id) === String(categoryId))
    return category ? category.name : "Unknown"
  }

  // Watch for restaurant ID changes
  watch(restaurantId, (newId) => {
    if (newId) loadCategories()
  })

  return {
    categories,
    loading,
    loadCategories,
    getCategoryName
  }
}
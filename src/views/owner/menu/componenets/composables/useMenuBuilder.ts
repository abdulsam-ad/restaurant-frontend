import { ref, reactive } from 'vue'
import type { Ref } from 'vue'
import { useToast } from 'vue-toastification'
import type { MenuForm } from '../types/menu'
import { haveMenu } from '../../../../../services/owner/menu'

export function useMenuBuilder(restaurantId: Ref<number | null>) {
  const toast = useToast()
  
  const menuForm: MenuForm = reactive({
    name: "",
    description: "",
    restaurant: restaurantId.value,
  })

  const menuSaved = ref<boolean>(false)
  const savingMenu = ref<boolean>(false)

  async function saveMenu(): Promise<boolean> {
    if (!menuForm.name?.trim()) {
      toast.error("Menu name is required.")
      return false
    }

    try {
      if (!restaurantId.value) {
        toast.error("Restaurant ID is missing.")
        return false
      }

      const menuExists = await haveMenu(restaurantId.value, menuForm.name)
      if (menuExists.data) {
        toast.error("Menu with this name already exists.")
        return false
      }

      savingMenu.value = true
      menuSaved.value = true
      toast.success("Menu saved. You can now add items.")
      return true
    } catch (error) {
      console.error("Save menu error:", error)
      toast.error("Failed to save menu.")
      return false
    } finally {
      savingMenu.value = false
    }
  }

  function resetMenuForm(): void {
    menuForm.name = ""
    menuForm.description = ""
    menuSaved.value = false
  }

  return {
    menuForm,
    menuSaved,
    savingMenu,
    saveMenu,
    resetMenuForm
  }
}
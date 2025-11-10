import { ref } from 'vue'
import type { Ref } from 'vue'

interface FormObject {
  file: File | null;
}

export function useImageUpload() {
  const imagePreview = ref<string | null>(null)

  function handleImageChange(
    event: Event, 
    formObject: FormObject, 
    previewRef: Ref<string | null>
  ): void {
    const target = event.target as HTMLInputElement
    const file = target.files?.[0]
    
    if (!file) {
      formObject.file = null
      previewRef.value = null
      return
    }

    formObject.file = file
    
    const reader = new FileReader()
    reader.onload = (ev) => {
      previewRef.value = ev.target?.result as string
    }
    reader.readAsDataURL(file)
  }

  function clearImagePreview(previewRef: Ref<string | null>): void {
    previewRef.value = null
  }

  return {
    imagePreview,
    handleImageChange,
    clearImagePreview
  }
}
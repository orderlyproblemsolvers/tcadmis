// composables/useToast.ts
export const useToast = () => {
  const toast = useState('toast', () => ({ 
    visible: false, 
    message: '', 
    type: 'success' 
  }))

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    toast.value = { message, type, visible: true }
    setTimeout(() => {
      toast.value.visible = false
    }, 3000)
  }

  return { showToast }
}
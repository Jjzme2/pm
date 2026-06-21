export function useNotification() {
  const toast = useToast()

  function success(title: string, description?: string) {
    toast.add({ title, description, color: 'green', icon: 'i-lucide-circle-check' })
  }

  function error(title: string, description?: string) {
    toast.add({ title, description, color: 'red', icon: 'i-lucide-circle-x' })
  }

  function info(title: string, description?: string) {
    toast.add({ title, description, color: 'blue', icon: 'i-lucide-info' })
  }

  return { success, error, info }
}

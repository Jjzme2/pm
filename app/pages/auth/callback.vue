<script setup lang="ts">
import { signInWithCustomToken } from 'firebase/auth'

definePageMeta({ layout: 'auth' })
useSeoMeta({ title: 'Signing in…', robots: 'noindex' })

const route = useRoute()
const error = ref('')

onMounted(async () => {
  const token = route.query.token as string | undefined
  const rawRedirect = route.query.redirect as string | undefined
  const redirect = rawRedirect?.startsWith('/') && !rawRedirect.startsWith('//') ? rawRedirect : '/'

  if (!token) {
    error.value = 'No auth token received.'
    return
  }

  try {
    const auth = useFirebaseAuth()!
    await signInWithCustomToken(auth, token)
    await navigateTo(redirect)
  } catch {
    error.value = 'Sign-in failed. Please try again.'
  }
})
</script>

<template>
  <div class="text-center">
    <template v-if="!error">
      <UIcon name="i-lucide-loader-circle" class="size-8 text-primary animate-spin mx-auto mb-3" />
      <p class="text-sm text-muted">Signing you in…</p>
    </template>
    <template v-else>
      <UIcon name="i-lucide-alert-circle" class="size-8 text-red-500 mx-auto mb-3" />
      <p class="text-sm text-muted mb-4">{{ error }}</p>
      <UButton label="Back to login" to="/auth/login" variant="outline" size="sm" />
    </template>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'auth' })

const config = useRuntimeConfig()

onMounted(() => {
  window.location.href = `${config.public.hubUrl}/auth/login`
})
</script>

<template>
  <div class="text-center">
    <UIcon name="i-lucide-loader-circle" class="size-8 text-violet-500 animate-spin mx-auto mb-3" />
    <p class="text-sm text-zinc-500">Redirecting to ILYTAT Suite…</p>
  </div>
</template>

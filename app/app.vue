<script setup lang="ts">
const timerStore = useTimerStore()

useHead({
  meta: [{ name: 'viewport', content: 'width=device-width, initial-scale=1' }],
  link: [{ rel: 'icon', href: '/favicon.ico' }],
  htmlAttrs: { lang: 'en' }
})

useSeoMeta({
  titleTemplate: '%s — ILYTAT PM',
  title: 'ILYTAT PM',
  description: 'Project management for the ILYTAT Suite',
  ogTitle: 'ILYTAT PM',
  ogDescription: 'Project management for the ILYTAT Suite',
  ogType: 'website',
  twitterCard: 'summary'
})

onMounted(() => {
  timerStore.load()
})
</script>

<template>
  <UApp>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <UToaster />
  </UApp>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' })
useSeoMeta({ title: 'Timers' })
</script>

<template>
  <div class="p-6 max-w-2xl mx-auto">
    <div class="mb-6">
      <h1 class="text-xl font-bold text-zinc-900 dark:text-zinc-100">Timers</h1>
      <p class="text-sm text-zinc-500">Track time across all projects</p>
    </div>

    <div class="mb-6">
      <h2 class="text-sm font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider mb-3">Current Session</h2>
      <TimerWidget />
    </div>

    <div>
      <h2 class="text-sm font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider mb-3">All Sessions</h2>
      <TimerHistory />
    </div>
  </div>
</template>

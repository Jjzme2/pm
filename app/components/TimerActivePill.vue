<script setup lang="ts">
const timerStore = useTimerStore()
const { stopTimer } = useTimers()
const { success } = useNotification()

async function handleStop() {
  await stopTimer()
  success('Timer stopped', `Session saved`)
}
</script>

<template>
  <div v-if="timerStore.active" class="flex items-center gap-2 px-3 py-1.5 bg-violet-50 dark:bg-violet-950/40 border border-violet-200 dark:border-violet-800 rounded-full text-sm">
    <span class="size-2 rounded-full bg-violet-500 animate-pulse shrink-0" />
    <span class="text-violet-700 dark:text-violet-300 font-medium truncate max-w-36">
      {{ timerStore.active.label }}
    </span>
    <span class="font-mono text-violet-600 dark:text-violet-400 tabular-nums">
      {{ timerStore.formattedElapsed }}
    </span>
    <UButton
      icon="i-lucide-square"
      color="violet"
      variant="ghost"
      size="xs"
      @click="handleStop"
    />
  </div>
</template>

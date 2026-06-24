<script setup lang="ts">
const props = defineProps<{
  projectId?: string | null
  taskId?: string | null
}>()

const timerStore = useTimerStore()
const { startTimer, stopTimer } = useTimers(
  computed(() => props.projectId ?? null)
)
const { success } = useNotification()

const label = ref('Work session')
const loading = ref(false)

async function start() {
  if (timerStore.active) return
  loading.value = true
  try {
    await startTimer({
      label: label.value || 'Work session',
      projectId: props.projectId ?? null,
      taskId: props.taskId ?? null
    })
  } finally {
    loading.value = false
  }
}

async function stop() {
  loading.value = true
  try {
    await stopTimer()
    success('Timer stopped', 'Session saved')
  } finally {
    loading.value = false
  }
}

const isRunningHere = computed(() =>
  timerStore.active &&
  timerStore.active.projectId === (props.projectId ?? null)
)
</script>

<template>
  <div class="flex items-center gap-3 p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-200 dark:border-zinc-700">
    <UIcon name="i-lucide-timer" class="size-5 text-violet-500 shrink-0" />

    <div class="flex-1 min-w-0">
      <div v-if="timerStore.active && isRunningHere" class="flex items-center gap-2">
        <span class="size-2 rounded-full bg-violet-500 animate-pulse" />
        <span class="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">
          {{ timerStore.active.label }}
        </span>
        <span class="font-mono text-sm font-semibold text-violet-600 dark:text-violet-400 tabular-nums ml-auto">
          {{ timerStore.formattedElapsed }}
        </span>
      </div>
      <div v-else-if="timerStore.active" class="text-sm text-zinc-400 dark:text-zinc-500">
        Timer running elsewhere
      </div>
      <UInput
        v-else
        v-model="label"
        placeholder="Session label…"
        size="sm"
        variant="ghost"
        class="text-sm"
      />
    </div>

    <UButton
      v-if="!timerStore.active"
      icon="i-lucide-play"
      color="violet"
      size="sm"
      :loading="loading"
      @click="start"
    />
    <UButton
      v-else-if="isRunningHere"
      icon="i-lucide-square"
      color="neutral"
      size="sm"
      :loading="loading"
      @click="stop"
    />
  </div>
</template>

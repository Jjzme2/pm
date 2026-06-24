<script setup lang="ts">
import type { TimerSession } from '~/types'
import { formatDuration } from '~/utils/task'

const props = defineProps<{
  projectId?: string | null
}>()

const { sessions, totalDuration, deleteSession } = useTimers(
  computed(() => props.projectId ?? null)
)
const { success } = useNotification()

function formatDate(session: TimerSession) {
  if (!session.startTime) return ''
  return session.startTime.toDate().toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit'
  })
}

async function handleDelete(id: string) {
  await deleteSession(id)
  success('Session deleted')
}
</script>

<template>
  <div>
    <!-- Total -->
    <div v-if="sessions?.length" class="flex items-center gap-2 mb-3 px-1">
      <UIcon name="i-lucide-clock" class="size-4 text-zinc-400" />
      <span class="text-sm text-zinc-500 dark:text-zinc-400">
        Total tracked: <strong class="text-zinc-700 dark:text-zinc-200">{{ formatDuration(totalDuration) }}</strong>
      </span>
    </div>

    <!-- Sessions -->
    <div v-if="sessions?.length" class="space-y-1.5">
      <div
        v-for="session in sessions"
        :key="session.id"
        class="group flex items-center gap-3 px-3 py-2.5 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700"
      >
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-zinc-800 dark:text-zinc-200 truncate">{{ session.label }}</p>
          <p class="text-xs text-zinc-400">{{ formatDate(session) }}</p>
        </div>
        <span class="text-sm font-mono font-medium text-zinc-600 dark:text-zinc-300 tabular-nums shrink-0">
          {{ formatDuration(session.duration) }}
        </span>
        <div
          v-if="!session.endTime"
          class="size-2 rounded-full bg-violet-500 animate-pulse shrink-0"
          title="Running"
        />
        <UButton
          icon="i-lucide-trash-2"
          color="neutral"
          variant="ghost"
          size="xs"
          class="opacity-0 group-hover:opacity-100 shrink-0"
          @click="handleDelete(session.id)"
        />
      </div>
    </div>

    <p v-else class="text-sm text-zinc-400 dark:text-zinc-600 text-center py-8">
      No timer sessions yet
    </p>
  </div>
</template>

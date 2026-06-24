<script setup lang="ts">
import type { Task } from '~/types'
import { PRIORITY_CONFIG } from '~/types'

const props = defineProps<{ task: Task }>()
const emit = defineEmits<{
  edit: [task: Task]
  delete: [id: string]
}>()

const dueStatus = computed(() => {
  if (!props.task.dueDate) return null
  const due = props.task.dueDate.toDate()
  const now = new Date()
  const diff = due.getTime() - now.getTime()
  if (diff < 0) return 'overdue'
  if (diff < 86400000) return 'today'
  return null
})

const formattedDue = computed(() => {
  if (!props.task.dueDate) return null
  return props.task.dueDate.toDate().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
})
</script>

<template>
  <div
    class="group bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg p-3 cursor-pointer hover:border-violet-300 dark:hover:border-violet-700 hover:shadow-sm transition-all select-none"
    @click="emit('edit', task)"
  >
    <!-- Priority indicator -->
    <div class="flex items-start justify-between gap-2 mb-2">
      <span
        class="text-xs font-medium flex items-center gap-1"
        :class="PRIORITY_CONFIG[task.priority]?.color"
      >
        <UIcon :name="PRIORITY_CONFIG[task.priority]?.icon" class="size-3" />
      </span>
      <UButton
        icon="i-lucide-trash-2"
        color="neutral"
        variant="ghost"
        size="xs"
        class="opacity-0 group-hover:opacity-100 -mt-1 -mr-1 shrink-0"
        @click.stop="emit('delete', task.id)"
      />
    </div>

    <!-- Title -->
    <p class="text-sm font-medium text-zinc-900 dark:text-zinc-100 leading-snug mb-2">
      {{ task.title }}
    </p>

    <!-- Description preview -->
    <p v-if="task.description" class="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2 mb-2">
      {{ task.description }}
    </p>

    <!-- Checklist progress -->
    <div v-if="task.checklist?.length" class="mb-2">
      <div class="flex items-center justify-between text-xs text-zinc-400 mb-1">
        <span class="flex items-center gap-1">
          <UIcon name="i-lucide-check-square" class="size-3" />
          {{ task.checklist.filter(c => c.done).length }}/{{ task.checklist.length }}
        </span>
      </div>
      <div class="h-1 bg-zinc-100 dark:bg-zinc-700 rounded-full overflow-hidden">
        <div
          class="h-full rounded-full transition-all"
          :class="task.checklist.every(c => c.done) ? 'bg-emerald-500' : 'bg-violet-400'"
          :style="{ width: `${Math.round((task.checklist.filter(c => c.done).length / task.checklist.length) * 100)}%` }"
        />
      </div>
    </div>

    <!-- Footer: tags + due date -->
    <div class="flex items-center gap-1.5 flex-wrap mt-1">
      <span
        v-for="tag in task.tags.slice(0, 2)"
        :key="tag"
        class="inline-flex items-center px-1.5 py-0.5 rounded text-xs bg-zinc-100 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300"
      >
        {{ tag }}
      </span>
      <span
        v-if="task.tags.length > 2"
        class="text-xs text-zinc-400"
      >+{{ task.tags.length - 2 }}</span>

      <span
        v-if="formattedDue"
        class="ml-auto text-xs flex items-center gap-1"
        :class="{
          'text-rose-500 font-medium': dueStatus === 'overdue',
          'text-amber-500 font-medium': dueStatus === 'today',
          'text-zinc-400': !dueStatus
        }"
      >
        <UIcon name="i-lucide-calendar" class="size-3" />
        {{ formattedDue }}
      </span>
    </div>
  </div>
</template>

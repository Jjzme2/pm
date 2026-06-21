<script setup lang="ts">
import { VueDraggable } from 'vue-draggable-plus'
import type { Task, TaskStatus } from '~/types'
import { TASK_COLUMNS } from '~/types'

const props = defineProps<{
  status: TaskStatus
  tasks: Task[]
  projectId: string
}>()

const emit = defineEmits<{
  editTask: [task: Task]
  deleteTask: [id: string]
  addTask: [status: TaskStatus]
  reorder: [status: TaskStatus, tasks: Task[]]
  move: [taskId: string, newStatus: TaskStatus]
}>()

const colConfig = TASK_COLUMNS.find(c => c.id === props.status)!

const localTasks = ref<Task[]>([])

// Only sync from props when the set of task IDs actually changes (not just order),
// to avoid snapping back after a local drag reorder.
watch(() => props.tasks, (newTasks) => {
  const localIds = new Set(localTasks.value.map(t => t.id))
  const newIds = new Set(newTasks.map(t => t.id))
  const sameSet = newTasks.length === localTasks.value.length &&
    newTasks.every(t => localIds.has(t.id)) &&
    localTasks.value.every(t => newIds.has(t.id))
  if (!sameSet) {
    localTasks.value = [...newTasks]
  }
}, { immediate: true })

function onUpdate() {
  emit('reorder', props.status, localTasks.value)
}

function onAdd(evt: Event & { item?: HTMLElement }) {
  const taskId = (evt as any).item?.dataset?.id as string | undefined
  if (taskId) emit('move', taskId, props.status)
}
</script>

<template>
  <div class="flex flex-col w-72 flex-shrink-0 bg-zinc-100 dark:bg-zinc-900/60 rounded-xl">
    <!-- Column header -->
    <div class="flex items-center justify-between px-3 py-2.5">
      <div class="flex items-center gap-2">
        <UIcon :name="colConfig.icon" class="size-4" :class="colConfig.color" />
        <span class="text-sm font-semibold text-zinc-700 dark:text-zinc-300">{{ colConfig.label }}</span>
        <UBadge
          :label="String(tasks.length)"
          color="neutral"
          variant="subtle"
          size="xs"
        />
      </div>
      <UButton
        icon="i-lucide-plus"
        color="neutral"
        variant="ghost"
        size="xs"
        @click="emit('addTask', status)"
      />
    </div>

    <!-- Cards list -->
    <VueDraggable
      v-model="localTasks"
      :group="{ name: `kanban-${projectId}`, put: true, pull: true }"
      item-key="id"
      ghost-class="kanban-ghost"
      drag-class="kanban-drag"
      class="flex flex-col gap-2 px-2 pb-2 min-h-16 flex-1"
      @update="onUpdate"
      @add="onAdd"
    >
      <KanbanCard
        v-for="task in localTasks"
        :key="task.id"
        :task="task"
        :data-id="task.id"
        @edit="emit('editTask', $event)"
        @delete="emit('deleteTask', $event)"
      />
    </VueDraggable>

    <!-- Add task button -->
    <button
      class="mx-2 mb-2 flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
      @click="emit('addTask', status)"
    >
      <UIcon name="i-lucide-plus" class="size-3.5" />
      Add task
    </button>
  </div>
</template>

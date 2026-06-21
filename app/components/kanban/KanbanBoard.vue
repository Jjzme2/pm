<script setup lang="ts">
import type { Task, TaskStatus } from '~/types'
import { TASK_COLUMNS } from '~/types'

const props = defineProps<{ projectId: string }>()

const { tasks, tasksByStatus, deleteTask, reorderColumn, moveTask } = useTasks(toRef(props, 'projectId'))
const { success } = useNotification()

const showTaskModal = ref(false)
const editingTask = ref<Task | null>(null)
const defaultStatus = ref<TaskStatus>('todo')

function openCreate(status: TaskStatus) {
  editingTask.value = null
  defaultStatus.value = status
  showTaskModal.value = true
}

function openEdit(task: Task) {
  editingTask.value = task
  showTaskModal.value = true
}

async function handleDelete(id: string) {
  await deleteTask(id)
  success('Task deleted')
}

async function handleReorder(status: TaskStatus, ordered: Task[]) {
  await reorderColumn(status, ordered)
}

async function handleMove(taskId: string, newStatus: TaskStatus) {
  await moveTask(taskId, newStatus)
}
</script>

<template>
  <div class="flex gap-4 overflow-x-auto pb-4 scrollbar-thin min-h-0 flex-1">
    <KanbanColumn
      v-for="col in TASK_COLUMNS"
      :key="col.id"
      :status="col.id"
      :tasks="tasksByStatus[col.id] ?? []"
      :project-id="projectId"
      @add-task="openCreate"
      @edit-task="openEdit"
      @delete-task="handleDelete"
      @reorder="handleReorder"
      @move="handleMove"
    />
  </div>

  <TaskModal
    v-if="showTaskModal"
    :task="editingTask"
    :project-id="projectId"
    :default-status="defaultStatus"
    @close="showTaskModal = false"
    @saved="showTaskModal = false"
  />
</template>

<script setup lang="ts">
import type { Task, TaskStatus, TaskPriority } from '~/types'
import { TASK_COLUMNS } from '~/types'

definePageMeta({ middleware: 'auth' })

const route = useRoute()
const projectId = computed(() => route.params.id as string)

const { tasks, updateTask, deleteTask } = useTasks(projectId)
const { success } = useNotification()

const filterStatus = ref<TaskStatus | 'all'>('all')
const filterPriority = ref<TaskPriority | 'all'>('all')
const searchQuery = ref('')
const sortBy = ref<'order' | 'dueDate' | 'priority' | 'title'>('order')
const sortDir = ref<'asc' | 'desc'>('asc')

const editingTask = ref<Task | null>(null)
const showTaskModal = ref(false)
const showCreateModal = ref(false)

const priorityWeight: Record<TaskPriority, number> = { high: 0, medium: 1, low: 2 }

const filteredTasks = computed(() => {
  let list = tasks.value ?? []

  if (filterStatus.value !== 'all') list = list.filter(t => t.status === filterStatus.value)
  if (filterPriority.value !== 'all') list = list.filter(t => t.priority === filterPriority.value)
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase()
    list = list.filter(t => t.title.toLowerCase().includes(q) || t.description?.toLowerCase().includes(q))
  }

  return [...list].sort((a, b) => {
    let result = 0
    if (sortBy.value === 'dueDate') {
      if (!a.dueDate && !b.dueDate) result = 0
      else if (!a.dueDate) result = 1
      else if (!b.dueDate) result = -1
      else result = a.dueDate.toMillis() - b.dueDate.toMillis()
    } else if (sortBy.value === 'priority') {
      result = priorityWeight[a.priority] - priorityWeight[b.priority]
    } else if (sortBy.value === 'title') {
      result = a.title.localeCompare(b.title)
    } else {
      result = (a.order ?? 0) - (b.order ?? 0)
    }
    return sortDir.value === 'asc' ? result : -result
  })
})

const priorityConfig = {
  high: { color: 'text-rose-500', icon: 'i-lucide-chevrons-up', label: 'High' },
  medium: { color: 'text-amber-500', icon: 'i-lucide-minus', label: 'Medium' },
  low: { color: 'text-sky-500', icon: 'i-lucide-chevrons-down', label: 'Low' }
}

const statusConfig = {
  todo: { label: 'To Do', color: 'text-zinc-400', icon: 'i-lucide-circle' },
  inprogress: { label: 'In Progress', color: 'text-blue-400', icon: 'i-lucide-circle-dot' },
  review: { label: 'Review', color: 'text-amber-400', icon: 'i-lucide-circle-dot-dashed' },
  done: { label: 'Done', color: 'text-emerald-400', icon: 'i-lucide-circle-check' }
}

const statusOptions = [
  { label: 'All', value: 'all' },
  ...TASK_COLUMNS.map(c => ({ label: c.label, value: c.id }))
]

const priorityOptions = [
  { label: 'All', value: 'all' },
  { label: 'High', value: 'high' },
  { label: 'Medium', value: 'medium' },
  { label: 'Low', value: 'low' }
]

function toggleSort(col: typeof sortBy.value) {
  if (sortBy.value === col) sortDir.value = sortDir.value === 'asc' ? 'desc' : 'asc'
  else { sortBy.value = col; sortDir.value = 'asc' }
}

function openEdit(task: Task) {
  editingTask.value = task
  showTaskModal.value = true
}

async function toggleDone(task: Task) {
  await updateTask(task.id, { status: task.status === 'done' ? 'todo' : 'done' })
}

async function handleDelete(id: string) {
  await deleteTask(id)
  success('Task deleted')
}

function dueDateClass(task: Task) {
  if (!task.dueDate || task.status === 'done') return 'text-zinc-400'
  const now = new Date()
  const due = task.dueDate.toDate()
  const diff = due.getTime() - now.getTime()
  if (diff < 0) return 'text-rose-500 font-medium'
  if (diff < 86400000) return 'text-amber-500 font-medium'
  return 'text-zinc-400'
}

const sortIcon = (col: typeof sortBy.value) => {
  if (sortBy.value !== col) return 'i-lucide-chevrons-up-down'
  return sortDir.value === 'asc' ? 'i-lucide-chevron-up' : 'i-lucide-chevron-down'
}
</script>

<template>
  <div class="p-6">
    <!-- Filters + actions -->
    <div class="flex flex-wrap items-center gap-2 mb-4">
      <UInput v-model="searchQuery" placeholder="Search…" icon="i-lucide-search" size="sm" class="w-44" />
      <USelect v-model="filterStatus" :items="statusOptions" value-key="value" label-key="label" size="sm" class="w-32" />
      <USelect v-model="filterPriority" :items="priorityOptions" value-key="value" label-key="label" size="sm" class="w-28" />
      <div class="flex-1" />
      <p class="text-sm text-zinc-400">{{ filteredTasks.length }} task{{ filteredTasks.length !== 1 ? 's' : '' }}</p>
      <UButton label="New Task" icon="i-lucide-plus" color="violet" size="sm" @click="showCreateModal = true" />
    </div>

    <!-- Table -->
    <div class="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl overflow-hidden">
      <!-- Header -->
      <div class="grid grid-cols-[auto_1fr_120px_100px_110px_80px_36px] items-center gap-3 px-4 py-2.5 border-b border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/80 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
        <span class="w-4" />
        <button class="flex items-center gap-1 text-left hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors" @click="toggleSort('title')">
          Title <UIcon :name="sortIcon('title')" class="size-3.5" />
        </button>
        <button class="flex items-center gap-1 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors" @click="toggleSort('priority')">
          Priority <UIcon :name="sortIcon('priority')" class="size-3.5" />
        </button>
        <span>Status</span>
        <button class="flex items-center gap-1 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors" @click="toggleSort('dueDate')">
          Due <UIcon :name="sortIcon('dueDate')" class="size-3.5" />
        </button>
        <span>Checks</span>
        <span />
      </div>

      <!-- Rows -->
      <div v-if="filteredTasks.length">
        <div
          v-for="task in filteredTasks"
          :key="task.id"
          class="group grid grid-cols-[auto_1fr_120px_100px_110px_80px_36px] items-center gap-3 px-4 py-3 border-b border-zinc-100 dark:border-zinc-700/60 last:border-0 hover:bg-zinc-50 dark:hover:bg-zinc-700/30 transition-colors"
        >
          <!-- Done toggle -->
          <button
            class="shrink-0 transition-colors"
            :class="task.status === 'done' ? 'text-emerald-500' : 'text-zinc-300 hover:text-zinc-400'"
            @click="toggleDone(task)"
          >
            <UIcon :name="task.status === 'done' ? 'i-lucide-circle-check' : 'i-lucide-circle'" class="size-4" />
          </button>

          <!-- Title + tags -->
          <div class="min-w-0 cursor-pointer" @click="openEdit(task)">
            <p
              class="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate"
              :class="{ 'line-through text-zinc-400': task.status === 'done' }"
            >
              {{ task.title }}
            </p>
            <div v-if="task.tags?.length" class="flex gap-1 mt-0.5 flex-wrap">
              <span
                v-for="tag in task.tags.slice(0, 3)"
                :key="tag"
                class="text-xs px-1 py-px rounded bg-zinc-100 dark:bg-zinc-700 text-zinc-500"
              >{{ tag }}</span>
            </div>
          </div>

          <!-- Priority -->
          <span class="flex items-center gap-1 text-xs" :class="priorityConfig[task.priority]?.color">
            <UIcon :name="priorityConfig[task.priority]?.icon" class="size-3.5" />
            {{ priorityConfig[task.priority]?.label }}
          </span>

          <!-- Status -->
          <span class="flex items-center gap-1 text-xs" :class="statusConfig[task.status]?.color">
            <UIcon :name="statusConfig[task.status]?.icon" class="size-3.5" />
            {{ statusConfig[task.status]?.label }}
          </span>

          <!-- Due date -->
          <span class="text-xs flex items-center gap-1" :class="task.dueDate ? dueDateClass(task) : 'text-zinc-300'">
            <UIcon name="i-lucide-calendar" class="size-3.5" />
            {{ task.dueDate
              ? task.dueDate.toDate().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
              : '—' }}
          </span>

          <!-- Checklist -->
          <span class="text-xs text-zinc-400 flex items-center gap-1">
            <template v-if="task.checklist?.length">
              <UIcon name="i-lucide-check-square" class="size-3.5" />
              {{ task.checklist.filter(c => c.done).length }}/{{ task.checklist.length }}
            </template>
            <span v-else class="text-zinc-300">—</span>
          </span>

          <!-- Delete -->
          <UButton
            icon="i-lucide-trash-2"
            color="neutral"
            variant="ghost"
            size="xs"
            class="opacity-0 group-hover:opacity-100 transition-opacity"
            @click="handleDelete(task.id)"
          />
        </div>
      </div>

      <div v-else class="py-12 text-center text-sm text-zinc-400">
        {{ searchQuery || filterStatus !== 'all' || filterPriority !== 'all'
          ? 'No tasks match your filters'
          : 'No tasks yet' }}
      </div>
    </div>

    <TaskModal
      v-if="showCreateModal"
      :project-id="projectId"
      @close="showCreateModal = false"
      @saved="showCreateModal = false"
    />

    <TaskModal
      v-if="showTaskModal && editingTask"
      :task="editingTask"
      :project-id="projectId"
      @close="showTaskModal = false"
      @saved="showTaskModal = false"
    />
  </div>
</template>

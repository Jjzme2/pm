<script setup lang="ts">
import type { Task, TaskStatus, TaskPriority } from '~/types'
import { TASK_COLUMNS } from '~/types'

definePageMeta({ middleware: 'auth' })
useSeoMeta({ title: 'My Tasks' })

const { tasks, updateTask, deleteTask } = useAllTasks()
const { projects } = useProjects()
const { success } = useNotification()

const filterStatus = ref<TaskStatus | 'all'>('all')
const filterPriority = ref<TaskPriority | 'all'>('all')
const filterProject = ref<string | 'all'>('all')
const searchQuery = ref('')
const sortBy = ref<'dueDate' | 'priority' | 'createdAt'>('createdAt')

const editingTask = ref<Task | null>(null)
const showTaskModal = ref(false)

const priorityWeight: Record<TaskPriority, number> = { high: 0, medium: 1, low: 2 }

const filteredTasks = computed(() => {
  let list = tasks.value ?? []

  if (filterStatus.value !== 'all') {
    list = list.filter(t => t.status === filterStatus.value)
  }
  if (filterPriority.value !== 'all') {
    list = list.filter(t => t.priority === filterPriority.value)
  }
  if (filterProject.value !== 'all') {
    list = list.filter(t => t.projectId === filterProject.value)
  }
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase()
    list = list.filter(t =>
      t.title.toLowerCase().includes(q) || t.description?.toLowerCase().includes(q)
    )
  }

  return [...list].sort((a, b) => {
    if (sortBy.value === 'dueDate') {
      if (!a.dueDate && !b.dueDate) return 0
      if (!a.dueDate) return 1
      if (!b.dueDate) return -1
      return a.dueDate.toMillis() - b.dueDate.toMillis()
    }
    if (sortBy.value === 'priority') {
      return priorityWeight[a.priority] - priorityWeight[b.priority]
    }
    return (b.createdAt?.toMillis() ?? 0) - (a.createdAt?.toMillis() ?? 0)
  })
})

const projectMap = computed(() => {
  const m: Record<string, typeof projects.value[0]> = {}
  for (const p of projects.value ?? []) m[p.id] = p
  return m
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

const statusOptions = [
  { label: 'All Statuses', value: 'all' },
  ...TASK_COLUMNS.map(c => ({ label: c.label, value: c.id }))
]

const priorityOptions = [
  { label: 'All Priorities', value: 'all' },
  { label: 'High', value: 'high' },
  { label: 'Medium', value: 'medium' },
  { label: 'Low', value: 'low' }
]

const projectOptions = computed(() => [
  { label: 'All Projects', value: 'all' },
  ...(projects.value ?? []).map(p => ({ label: p.name, value: p.id }))
])

const sortOptions = [
  { label: 'Newest First', value: 'createdAt' },
  { label: 'Due Date', value: 'dueDate' },
  { label: 'Priority', value: 'priority' }
]
</script>

<template>
  <div class="p-6 max-w-5xl mx-auto">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-xl font-bold text-zinc-900 dark:text-zinc-100">My Tasks</h1>
        <p class="text-sm text-zinc-500 dark:text-zinc-400">
          {{ filteredTasks.length }} task{{ filteredTasks.length !== 1 ? 's' : '' }}
          <span v-if="tasks?.length !== filteredTasks.length"> (filtered from {{ tasks?.length }})</span>
        </p>
      </div>
    </div>

    <!-- Filters -->
    <div class="flex flex-wrap gap-2 mb-5">
      <UInput
        v-model="searchQuery"
        placeholder="Search tasks…"
        icon="i-lucide-search"
        size="sm"
        class="w-48"
      />
      <USelect
        v-model="filterStatus"
        :items="statusOptions"
        value-key="value"
        label-key="label"
        size="sm"
        class="w-36"
      />
      <USelect
        v-model="filterPriority"
        :items="priorityOptions"
        value-key="value"
        label-key="label"
        size="sm"
        class="w-36"
      />
      <USelect
        v-model="filterProject"
        :items="projectOptions"
        value-key="value"
        label-key="label"
        size="sm"
        class="w-40"
      />
      <USelect
        v-model="sortBy"
        :items="sortOptions"
        value-key="value"
        label-key="label"
        size="sm"
        class="w-36"
      />
    </div>

    <!-- Task list -->
    <div v-if="filteredTasks.length" class="space-y-1">
      <div
        v-for="task in filteredTasks"
        :key="task.id"
        class="group flex items-start gap-3 p-3 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg hover:border-violet-200 dark:hover:border-violet-800 transition-all"
      >
        <!-- Done toggle -->
        <button
          class="mt-0.5 shrink-0 transition-colors"
          :class="task.status === 'done' ? 'text-emerald-500' : 'text-zinc-300 hover:text-zinc-400'"
          @click="toggleDone(task)"
        >
          <UIcon
            :name="task.status === 'done' ? 'i-lucide-circle-check' : 'i-lucide-circle'"
            class="size-4.5"
          />
        </button>

        <!-- Content -->
        <div class="flex-1 min-w-0 cursor-pointer" @click="openEdit(task)">
          <div class="flex items-center gap-2 flex-wrap">
            <span
              class="text-sm font-medium text-zinc-900 dark:text-zinc-100"
              :class="{ 'line-through text-zinc-400': task.status === 'done' }"
            >
              {{ task.title }}
            </span>
            <!-- Project badge -->
            <NuxtLink
              v-if="projectMap[task.projectId]"
              :to="`/projects/${task.projectId}`"
              class="text-xs px-1.5 py-0.5 rounded font-medium truncate max-w-28 hover:opacity-80 transition-opacity"
              :class="`text-${projectMap[task.projectId].color}-600 dark:text-${projectMap[task.projectId].color}-400 bg-${projectMap[task.projectId].color}-50 dark:bg-${projectMap[task.projectId].color}-950/40`"
              @click.stop
            >
              {{ projectMap[task.projectId].name }}
            </NuxtLink>
          </div>
          <p v-if="task.description" class="text-xs text-zinc-500 dark:text-zinc-400 truncate mt-0.5">
            {{ task.description }}
          </p>
        </div>

        <!-- Meta -->
        <div class="flex items-center gap-3 shrink-0">
          <!-- Checklist progress -->
          <span
            v-if="task.checklist?.length"
            class="text-xs text-zinc-400 flex items-center gap-1"
          >
            <UIcon name="i-lucide-check-square" class="size-3.5" />
            {{ task.checklist.filter(c => c.done).length }}/{{ task.checklist.length }}
          </span>

          <!-- Priority -->
          <UIcon
            :name="priorityConfig[task.priority]?.icon"
            class="size-4"
            :class="priorityConfig[task.priority]?.color"
            :title="priorityConfig[task.priority]?.label"
          />

          <!-- Status -->
          <span class="hidden sm:flex items-center gap-1 text-xs" :class="statusConfig[task.status]?.color">
            <UIcon :name="statusConfig[task.status]?.icon" class="size-3.5" />
            {{ statusConfig[task.status]?.label }}
          </span>

          <!-- Due date -->
          <span v-if="task.dueDate" class="text-xs flex items-center gap-1" :class="dueDateClass(task)">
            <UIcon name="i-lucide-calendar" class="size-3.5" />
            {{ task.dueDate.toDate().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) }}
          </span>

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
    </div>

    <div v-else class="text-center py-20 bg-zinc-50 dark:bg-zinc-900/50 rounded-xl border border-dashed border-zinc-300 dark:border-zinc-700">
      <UIcon name="i-lucide-check-square" class="size-12 text-zinc-300 dark:text-zinc-600 mx-auto mb-3" />
      <p class="text-zinc-500 dark:text-zinc-400">
        {{ searchQuery || filterStatus !== 'all' || filterPriority !== 'all' || filterProject !== 'all'
          ? 'No tasks match your filters'
          : 'No tasks yet — create tasks inside a project' }}
      </p>
    </div>

    <TaskModal
      v-if="showTaskModal && editingTask"
      :task="editingTask"
      :project-id="editingTask.projectId"
      @close="showTaskModal = false"
      @saved="showTaskModal = false"
    />
  </div>
</template>

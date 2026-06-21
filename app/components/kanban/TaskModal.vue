<script setup lang="ts">
import { Timestamp } from 'firebase/firestore'
import type { Task, TaskStatus, TaskPriority } from '~/types'
import { TASK_COLUMNS } from '~/types'

const props = defineProps<{
  task?: Task | null
  projectId: string
  defaultStatus?: TaskStatus
}>()

const emit = defineEmits<{
  close: []
  saved: []
}>()

const { createTask, updateTask } = useTasks(toRef(props, 'projectId'))
const { success, error } = useNotification()

const isEditing = computed(() => !!props.task)

const form = reactive({
  title: '',
  description: '',
  status: (props.defaultStatus ?? 'todo') as TaskStatus,
  priority: 'medium' as TaskPriority,
  tags: [] as string[],
  dueDateStr: '' // YYYY-MM-DD string for the date input
})

const tagInput = ref('')
const loading = ref(false)

watch(() => props.task, (task) => {
  if (task) {
    form.title = task.title
    form.description = task.description
    form.status = task.status
    form.priority = task.priority
    form.tags = [...task.tags]
    const d = task.dueDate?.toDate()
    form.dueDateStr = d ? d.toISOString().slice(0, 10) : ''
  } else {
    form.title = ''
    form.description = ''
    form.status = (props.defaultStatus ?? 'todo') as TaskStatus
    form.priority = 'medium'
    form.tags = []
    form.dueDateStr = ''
  }
}, { immediate: true })

function addTag() {
  const tag = tagInput.value.trim().toLowerCase()
  if (tag && !form.tags.includes(tag)) {
    form.tags.push(tag)
  }
  tagInput.value = ''
}

function removeTag(tag: string) {
  form.tags = form.tags.filter(t => t !== tag)
}

async function save() {
  if (!form.title.trim()) return
  loading.value = true
  try {
    const dueDate = form.dueDateStr ? new Date(form.dueDateStr) : null
    if (isEditing.value && props.task) {
      await updateTask(props.task.id, {
        title: form.title,
        description: form.description,
        status: form.status,
        priority: form.priority,
        tags: form.tags,
        dueDate: dueDate ? Timestamp.fromDate(dueDate) : null
      })
      success('Task updated')
    } else {
      await createTask({
        title: form.title,
        description: form.description,
        status: form.status,
        priority: form.priority,
        tags: form.tags,
        dueDate
      })
      success('Task created')
    }
    emit('saved')
    emit('close')
  } catch (e: any) {
    error('Failed to save task', e?.message)
  } finally {
    loading.value = false
  }
}

const priorityOptions = [
  { label: 'Low', value: 'low', icon: 'i-lucide-chevrons-down' },
  { label: 'Medium', value: 'medium', icon: 'i-lucide-minus' },
  { label: 'High', value: 'high', icon: 'i-lucide-chevrons-up' }
]

const statusOptions = TASK_COLUMNS.map(c => ({ label: c.label, value: c.id }))
</script>

<template>
  <UModal :title="isEditing ? 'Edit Task' : 'New Task'" @close="emit('close')">
    <template #body>
      <div class="space-y-4">
        <UFormField label="Title">
          <UInput
            v-model="form.title"
            placeholder="Task title"
            autofocus
            class="w-full"
            @keydown.enter="save"
          />
        </UFormField>

        <UFormField label="Description">
          <UTextarea
            v-model="form.description"
            placeholder="Optional description…"
            :rows="3"
            class="w-full"
          />
        </UFormField>

        <div class="grid grid-cols-2 gap-3">
          <UFormField label="Status">
            <USelect
              v-model="form.status"
              :items="statusOptions"
              value-key="value"
              label-key="label"
              class="w-full"
            />
          </UFormField>
          <UFormField label="Priority">
            <USelect
              v-model="form.priority"
              :items="priorityOptions"
              value-key="value"
              label-key="label"
              class="w-full"
            />
          </UFormField>
        </div>

        <UFormField label="Due Date">
          <UInput
            v-model="form.dueDateStr"
            type="date"
            class="w-full"
          />
        </UFormField>

        <UFormField label="Tags">
          <div class="flex gap-2">
            <UInput
              v-model="tagInput"
              placeholder="Add tag…"
              class="flex-1"
              @keydown.enter.prevent="addTag"
            />
            <UButton label="Add" color="neutral" variant="outline" @click="addTag" />
          </div>
          <div v-if="form.tags.length" class="flex flex-wrap gap-1.5 mt-2">
            <span
              v-for="tag in form.tags"
              :key="tag"
              class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-violet-100 dark:bg-violet-950/40 text-violet-700 dark:text-violet-300"
            >
              {{ tag }}
              <button class="hover:text-rose-500 transition-colors" @click="removeTag(tag)">
                <UIcon name="i-lucide-x" class="size-3" />
              </button>
            </span>
          </div>
        </UFormField>
      </div>
    </template>

    <template #footer>
      <div class="flex justify-end gap-2">
        <UButton label="Cancel" color="neutral" variant="ghost" @click="emit('close')" />
        <UButton
          :label="isEditing ? 'Save Changes' : 'Create Task'"
          color="violet"
          :loading="loading"
          :disabled="!form.title.trim()"
          @click="save"
        />
      </div>
    </template>
  </UModal>
</template>

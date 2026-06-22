<script setup lang="ts">
import type { Project, ProjectColor, ProjectStatus } from '~/types'
import { PROJECT_COLORS, PROJECT_ICONS } from '~/types'

const props = defineProps<{ project?: Project | null }>()
const emit = defineEmits<{ close: []; saved: [] }>()

const { createProject, updateProject } = useProjects()
const { success, error } = useNotification()

const isEditing = computed(() => !!props.project)

const form = reactive({
  name: '',
  description: '',
  color: 'violet' as ProjectColor,
  icon: 'i-lucide-folder',
  status: 'active' as ProjectStatus
})

const open = ref(true)
watch(open, (val) => { if (!val) emit('close') })

const loading = ref(false)

watch(() => props.project, (project) => {
  if (project) {
    form.name = project.name
    form.description = project.description
    form.color = project.color
    form.icon = project.icon
    form.status = project.status ?? 'active'
  } else {
    form.name = ''
    form.description = ''
    form.color = 'violet'
    form.icon = 'i-lucide-folder'
    form.status = 'active'
  }
}, { immediate: true })

async function save() {
  if (!form.name.trim()) return
  loading.value = true
  try {
    if (isEditing.value && props.project) {
      await updateProject(props.project.id, { ...form })
      success('Project updated')
    } else {
      await createProject({ ...form })
      success('Project created')
    }
    emit('saved')
    emit('close')
  } catch (e: any) {
    error('Failed to save', e?.message)
  } finally {
    loading.value = false
  }
}

const iconBg = computed(() => {
  const map: Record<string, string> = {
    violet: 'bg-violet-100 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400',
    blue: 'bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400',
    emerald: 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400',
    amber: 'bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400',
    rose: 'bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400',
    sky: 'bg-sky-100 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400',
    green: 'bg-green-100 dark:bg-green-950/60 text-green-600 dark:text-green-400',
    orange: 'bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400',
    pink: 'bg-pink-100 dark:bg-pink-950/60 text-pink-600 dark:text-pink-400',
    indigo: 'bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400',
    teal: 'bg-teal-100 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400',
    purple: 'bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400'
  }
  return map[form.color] || map.violet
})
</script>

<template>
  <UModal v-model:open="open" :title="isEditing ? 'Edit Project' : 'New Project'">
    <template #body>
      <div class="space-y-5">
        <!-- Preview -->
        <div class="flex items-center gap-3">
          <div class="size-14 rounded-2xl flex items-center justify-center shrink-0 transition-all" :class="iconBg">
            <UIcon :name="form.icon" class="size-7" />
          </div>
          <div>
            <p class="font-semibold text-zinc-900 dark:text-zinc-100">{{ form.name || 'Project name' }}</p>
            <p class="text-sm text-zinc-400">{{ form.description || 'No description' }}</p>
          </div>
        </div>

        <UFormField label="Name" required>
          <UInput v-model="form.name" placeholder="My awesome project" class="w-full" autofocus />
        </UFormField>

        <UFormField label="Description">
          <UInput v-model="form.description" placeholder="What is this project about?" class="w-full" />
        </UFormField>

        <!-- Color picker -->
        <UFormField label="Color">
          <div class="flex flex-wrap gap-2">
            <button
              v-for="color in PROJECT_COLORS"
              :key="color"
              class="size-7 rounded-full transition-transform hover:scale-110"
              :class="[
                `bg-${color}-400`,
                form.color === color ? 'ring-2 ring-offset-2 ring-zinc-400 dark:ring-zinc-600 scale-110' : ''
              ]"
              @click="form.color = color"
            />
          </div>
        </UFormField>

        <!-- Status -->
        <UFormField label="Status">
          <div class="flex gap-2 flex-wrap">
            <button
              v-for="s in [
                { value: 'active', label: 'Active', icon: 'i-lucide-play-circle' },
                { value: 'on_hold', label: 'On Hold', icon: 'i-lucide-pause-circle' },
                { value: 'completed', label: 'Completed', icon: 'i-lucide-check-circle' },
                { value: 'archived', label: 'Archived', icon: 'i-lucide-archive' }
              ]"
              :key="s.value"
              class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all"
              :class="form.status === s.value
                ? 'bg-violet-50 dark:bg-violet-950/40 border-violet-300 dark:border-violet-700 text-violet-600 dark:text-violet-400'
                : 'bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-500 hover:border-zinc-300'"
              @click="form.status = s.value as ProjectStatus"
            >
              <UIcon :name="s.icon" class="size-3.5" />
              {{ s.label }}
            </button>
          </div>
        </UFormField>

        <!-- Icon picker -->
        <UFormField label="Icon">
          <div class="flex flex-wrap gap-2">
            <button
              v-for="icon in PROJECT_ICONS"
              :key="icon"
              class="size-9 rounded-lg flex items-center justify-center transition-all"
              :class="form.icon === icon
                ? 'bg-violet-100 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400 ring-2 ring-violet-400'
                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 hover:bg-zinc-200 dark:hover:bg-zinc-700'"
              @click="form.icon = icon"
            >
              <UIcon :name="icon" class="size-5" />
            </button>
          </div>
        </UFormField>
      </div>
    </template>

    <template #footer>
      <div class="flex justify-end gap-2">
        <UButton label="Cancel" color="neutral" variant="ghost" @click="emit('close')" />
        <UButton
          :label="isEditing ? 'Save' : 'Create Project'"
          color="violet"
          :loading="loading"
          :disabled="!form.name.trim()"
          @click="save"
        />
      </div>
    </template>
  </UModal>
</template>

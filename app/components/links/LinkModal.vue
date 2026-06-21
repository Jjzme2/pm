<script setup lang="ts">
import type { QuickLink, ProjectColor } from '~/types'
import { PROJECT_COLORS } from '~/types'

const props = defineProps<{
  link?: QuickLink | null
  projectId?: string | null
}>()

const emit = defineEmits<{
  close: []
  saved: []
}>()

const { createLink, updateLink } = useLinks(
  computed(() => props.projectId ?? null)
)
const { success, error } = useNotification()

const isEditing = computed(() => !!props.link)

const form = reactive({
  title: '',
  url: '',
  description: '',
  color: 'violet' as ProjectColor
})

const loading = ref(false)

watch(() => props.link, (link) => {
  if (link) {
    form.title = link.title
    form.url = link.url
    form.description = link.description
    form.color = link.color
  } else {
    form.title = ''
    form.url = ''
    form.description = ''
    form.color = 'violet'
  }
}, { immediate: true })

async function save() {
  if (!form.title.trim() || !form.url.trim()) return
  loading.value = true
  try {
    if (isEditing.value && props.link) {
      await updateLink(props.link.id, { ...form })
      success('Link updated')
    } else {
      await createLink({ ...form, projectId: props.projectId ?? null })
      success('Link added')
    }
    emit('saved')
    emit('close')
  } catch (e: any) {
    error('Failed to save', e?.message)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <UModal :title="isEditing ? 'Edit Link' : 'Add Quick Link'" @close="emit('close')">
    <template #body>
      <div class="space-y-4">
        <UFormField label="Title" required>
          <UInput v-model="form.title" placeholder="Link title" class="w-full" autofocus />
        </UFormField>

        <UFormField label="URL" required>
          <UInput v-model="form.url" placeholder="https://…" type="url" class="w-full" />
        </UFormField>

        <UFormField label="Description">
          <UInput v-model="form.description" placeholder="Optional description" class="w-full" />
        </UFormField>

        <UFormField label="Color">
          <div class="flex flex-wrap gap-2">
            <button
              v-for="color in PROJECT_COLORS"
              :key="color"
              class="size-7 rounded-full transition-transform"
              :class="[
                `bg-${color}-400`,
                form.color === color ? 'ring-2 ring-offset-2 ring-zinc-400 scale-110' : 'hover:scale-110'
              ]"
              @click="form.color = color"
            />
          </div>
        </UFormField>
      </div>
    </template>

    <template #footer>
      <div class="flex justify-end gap-2">
        <UButton label="Cancel" color="neutral" variant="ghost" @click="emit('close')" />
        <UButton
          :label="isEditing ? 'Save' : 'Add Link'"
          color="violet"
          :loading="loading"
          :disabled="!form.title.trim() || !form.url.trim()"
          @click="save"
        />
      </div>
    </template>
  </UModal>
</template>

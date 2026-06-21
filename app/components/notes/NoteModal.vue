<script setup lang="ts">
import type { Note } from '~/types'

const props = defineProps<{
  note?: Note | null
  projectId?: string | null
}>()

const emit = defineEmits<{
  close: []
  saved: []
}>()

const { createNote, updateNote } = useNotes(
  computed(() => props.projectId ?? null)
)
const { success, error } = useNotification()

const isEditing = computed(() => !!props.note)

const form = reactive({
  title: '',
  content: '',
  tags: [] as string[]
})

const tagInput = ref('')
const loading = ref(false)

watch(() => props.note, (note) => {
  if (note) {
    form.title = note.title
    form.content = note.content
    form.tags = [...(note.tags ?? [])]
  } else {
    form.title = ''
    form.content = ''
    form.tags = []
  }
}, { immediate: true })

function addTag() {
  const tag = tagInput.value.trim().toLowerCase()
  if (tag && !form.tags.includes(tag)) form.tags.push(tag)
  tagInput.value = ''
}

function removeTag(tag: string) {
  form.tags = form.tags.filter(t => t !== tag)
}

async function save() {
  loading.value = true
  try {
    if (isEditing.value && props.note) {
      await updateNote(props.note.id, {
        title: form.title,
        content: form.content,
        tags: form.tags
      })
      success('Note saved')
    } else {
      await createNote({
        title: form.title,
        content: form.content,
        tags: form.tags,
        projectId: props.projectId ?? null
      })
      success('Note created')
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
  <UModal
    :title="isEditing ? 'Edit Note' : 'New Note'"
    fullscreen
    @close="emit('close')"
  >
    <template #body>
      <div class="flex flex-col h-full gap-3">
        <!-- Title -->
        <UInput
          v-model="form.title"
          placeholder="Note title…"
          size="xl"
          variant="ghost"
          class="text-lg font-semibold"
        />

        <!-- Tags -->
        <div class="flex items-center gap-2 flex-wrap">
          <span
            v-for="tag in form.tags"
            :key="tag"
            class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-violet-100 dark:bg-violet-950/40 text-violet-700 dark:text-violet-300"
          >
            {{ tag }}
            <button class="hover:text-rose-500" @click="removeTag(tag)">
              <UIcon name="i-lucide-x" class="size-3" />
            </button>
          </span>
          <UInput
            v-model="tagInput"
            placeholder="+ add tag"
            size="xs"
            variant="ghost"
            class="w-24"
            @keydown.enter.prevent="addTag"
            @keydown.comma.prevent="addTag"
          />
        </div>

        <!-- Editor -->
        <div class="flex-1 min-h-0 border border-zinc-200 dark:border-zinc-700 rounded-xl overflow-hidden">
          <NoteEditor
            v-model="form.content"
            placeholder="Start writing your note…"
            class="h-full"
          />
        </div>
      </div>
    </template>

    <template #footer>
      <div class="flex justify-end gap-2">
        <UButton label="Cancel" color="neutral" variant="ghost" @click="emit('close')" />
        <UButton
          :label="isEditing ? 'Save' : 'Create Note'"
          color="violet"
          :loading="loading"
          @click="save"
        />
      </div>
    </template>
  </UModal>
</template>

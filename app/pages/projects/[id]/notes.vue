<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

const route = useRoute()
const projectId = computed(() => route.params.id as string)

const { projects } = useProjects()
const project = computed(() => projects.value?.find(p => p.id === projectId.value))
useSeoMeta({ title: computed(() => project.value?.name ? `${project.value.name} — Notes` : 'Notes') })

const { notes, togglePin, deleteNote } = useNotes(projectId)
const { success } = useNotification()

const showModal = ref(false)
const editingNote = ref(null)

function openCreate() { editingNote.value = null; showModal.value = true }
function openEdit(note: any) { editingNote.value = note; showModal.value = true }

async function handlePin(note: any) {
  await togglePin(note.id, note.pinned)
}

async function handleDelete(id: string) {
  await deleteNote(id)
  success('Note deleted')
}
</script>

<template>
  <div class="flex flex-col h-full">
    <ProjectTabHeader :project-id="projectId" :project="project" />

    <div class="flex-1 overflow-y-auto scrollbar-thin p-6">
      <div class="flex items-center justify-between mb-5">
        <h2 class="text-base font-semibold text-zinc-800 dark:text-zinc-200">
          Notes <span class="text-zinc-400 font-normal text-sm ml-1">{{ notes?.length ?? 0 }}</span>
        </h2>
        <UButton label="New Note" icon="i-lucide-plus" color="violet" size="sm" @click="openCreate" />
      </div>

      <div v-if="notes?.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <NoteCard
          v-for="note in notes"
          :key="note.id"
          :note="note"
          @open="openEdit"
          @pin="handlePin"
          @delete="handleDelete"
        />
      </div>

      <div v-else class="text-center py-16 bg-zinc-50 dark:bg-zinc-900/50 rounded-xl border border-dashed border-zinc-300 dark:border-zinc-700">
        <UIcon name="i-lucide-notebook" class="size-12 text-zinc-300 dark:text-zinc-600 mx-auto mb-3" />
        <p class="text-sm text-zinc-500 mb-3">No notes for this project yet</p>
        <UButton label="Create Note" color="violet" size="sm" icon="i-lucide-plus" @click="openCreate" />
      </div>
    </div>

    <NoteModal
      v-if="showModal"
      :note="editingNote"
      :project-id="projectId"
      @close="showModal = false"
      @saved="showModal = false"
    />
  </div>
</template>

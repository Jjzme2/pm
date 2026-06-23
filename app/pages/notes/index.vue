<script setup lang="ts">
definePageMeta({ middleware: 'auth' })
useSeoMeta({ title: 'Notes' })

const { notes, togglePin, deleteNote } = useNotes()
const { success } = useNotification()

const showModal = ref(false)
const editingNote = ref(null)
const searchQuery = ref('')

const filteredNotes = computed(() => {
  if (!searchQuery.value.trim()) return notes.value ?? []
  const q = searchQuery.value.toLowerCase()
  return (notes.value ?? []).filter(n =>
    n.title.toLowerCase().includes(q) ||
    n.tags?.some(t => t.includes(q))
  )
})

function openCreate() { editingNote.value = null; showModal.value = true }
function openEdit(note: any) { editingNote.value = note; showModal.value = true }

async function handlePin(note: any) { await togglePin(note.id, note.pinned) }
async function handleDelete(id: string) { await deleteNote(id); success('Note deleted') }
</script>

<template>
  <div class="p-6 max-w-5xl mx-auto">
    <div class="flex items-center justify-between mb-5">
      <div>
        <h1 class="text-xl font-bold text-zinc-900 dark:text-zinc-100">Notes</h1>
        <p class="text-sm text-zinc-500">All notes across projects</p>
      </div>
      <UButton label="New Note" icon="i-lucide-plus" color="violet" @click="openCreate" />
    </div>

    <UInput
      v-model="searchQuery"
      placeholder="Search notes…"
      icon="i-lucide-search"
      class="mb-5 max-w-sm"
    />

    <div v-if="filteredNotes.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <NoteCard
        v-for="note in filteredNotes"
        :key="note.id"
        :note="note"
        @open="openEdit"
        @pin="handlePin"
        @delete="handleDelete"
      />
    </div>

    <div v-else class="text-center py-20 bg-zinc-50 dark:bg-zinc-900/50 rounded-xl border border-dashed border-zinc-300 dark:border-zinc-700">
      <UIcon name="i-lucide-notebook" class="size-14 text-zinc-300 dark:text-zinc-600 mx-auto mb-3" />
      <p class="font-medium text-zinc-600 dark:text-zinc-400 mb-1">
        {{ searchQuery ? 'No notes match your search' : 'No notes yet' }}
      </p>
      <p v-if="!searchQuery" class="text-sm text-zinc-400 mb-4">Capture ideas, meeting notes, and more</p>
      <UButton v-if="!searchQuery" label="Create Note" color="violet" icon="i-lucide-plus" @click="openCreate" />
    </div>

    <NoteModal
      v-if="showModal"
      :note="editingNote"
      @close="showModal = false"
      @saved="showModal = false"
    />
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

const { links, deleteLink } = useLinks()
const { success } = useNotification()

const showModal = ref(false)
const editingLink = ref(null)
const searchQuery = ref('')

const filteredLinks = computed(() => {
  if (!searchQuery.value.trim()) return links.value ?? []
  const q = searchQuery.value.toLowerCase()
  return (links.value ?? []).filter(l =>
    l.title.toLowerCase().includes(q) ||
    l.url.toLowerCase().includes(q) ||
    l.description?.toLowerCase().includes(q)
  )
})

function openCreate() { editingLink.value = null; showModal.value = true }
function openEdit(link: any) { editingLink.value = link; showModal.value = true }

async function handleDelete(id: string) {
  await deleteLink(id)
  success('Link removed')
}
</script>

<template>
  <div class="p-6 max-w-5xl mx-auto">
    <div class="flex items-center justify-between mb-5">
      <div>
        <h1 class="text-xl font-bold text-zinc-900 dark:text-zinc-100">Quick Links</h1>
        <p class="text-sm text-zinc-500">Your bookmarks across all projects</p>
      </div>
      <UButton label="Add Link" icon="i-lucide-plus" color="violet" @click="openCreate" />
    </div>

    <UInput
      v-model="searchQuery"
      placeholder="Search links…"
      icon="i-lucide-search"
      class="mb-5 max-w-sm"
    />

    <div v-if="filteredLinks.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <LinkCard
        v-for="link in filteredLinks"
        :key="link.id"
        :link="link"
        @edit="openEdit"
        @delete="handleDelete"
      />
    </div>

    <div v-else class="text-center py-20 bg-zinc-50 dark:bg-zinc-900/50 rounded-xl border border-dashed border-zinc-300 dark:border-zinc-700">
      <UIcon name="i-lucide-link" class="size-14 text-zinc-300 dark:text-zinc-600 mx-auto mb-3" />
      <p class="font-medium text-zinc-600 dark:text-zinc-400 mb-1">
        {{ searchQuery ? 'No links match your search' : 'No quick links yet' }}
      </p>
      <p v-if="!searchQuery" class="text-sm text-zinc-400 mb-4">Save frequently visited URLs for fast access</p>
      <UButton v-if="!searchQuery" label="Add Link" color="violet" icon="i-lucide-plus" @click="openCreate" />
    </div>

    <LinkModal
      v-if="showModal"
      :link="editingLink"
      @close="showModal = false"
      @saved="showModal = false"
    />
  </div>
</template>

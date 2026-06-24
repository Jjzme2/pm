<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

const route = useRoute()
const projectId = computed(() => route.params.id as string)

const { projects } = useProjects()
const project = computed(() => projects.value?.find(p => p.id === projectId.value))
useSeoMeta({ title: computed(() => project.value?.name ? `${project.value.name} — Links` : 'Links') })

const { links, deleteLink } = useLinks(projectId)
const { success } = useNotification()

const showModal = ref(false)
const editingLink = ref(null)

function openCreate() { editingLink.value = null; showModal.value = true }
function openEdit(link: any) { editingLink.value = link; showModal.value = true }

async function handleDelete(id: string) {
  await deleteLink(id)
  success('Link removed')
}
</script>

<template>
  <div class="flex flex-col h-full">
    <ProjectTabHeader :project-id="projectId" :project="project" />

    <div class="flex-1 overflow-y-auto scrollbar-thin p-6">
      <div class="flex items-center justify-between mb-5">
        <h2 class="text-base font-semibold text-zinc-800 dark:text-zinc-200">
          Quick Links <span class="text-zinc-400 font-normal text-sm ml-1">{{ links?.length ?? 0 }}</span>
        </h2>
        <UButton label="Add Link" icon="i-lucide-plus" color="violet" size="sm" @click="openCreate" />
      </div>

      <div v-if="links?.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <LinkCard
          v-for="link in links"
          :key="link.id"
          :link="link"
          @edit="openEdit"
          @delete="handleDelete"
        />
      </div>

      <div v-else class="text-center py-16 bg-zinc-50 dark:bg-zinc-900/50 rounded-xl border border-dashed border-zinc-300 dark:border-zinc-700">
        <UIcon name="i-lucide-link" class="size-12 text-zinc-300 dark:text-zinc-600 mx-auto mb-3" />
        <p class="text-sm text-zinc-500 mb-3">No quick links yet</p>
        <UButton label="Add Link" color="violet" size="sm" icon="i-lucide-plus" @click="openCreate" />
      </div>
    </div>

    <LinkModal
      v-if="showModal"
      :link="editingLink"
      :project-id="projectId"
      @close="showModal = false"
      @saved="showModal = false"
    />
  </div>
</template>

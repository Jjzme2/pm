<script setup lang="ts">
import type { Note } from '~/types'

const props = defineProps<{ note: Note }>()
const emit = defineEmits<{
  open: [note: Note]
  pin: [note: Note]
  delete: [id: string]
}>()

const timeAgo = computed(() => {
  if (!props.note.updatedAt) return ''
  const d = props.note.updatedAt.toDate()
  const now = new Date()
  const diff = now.getTime() - d.getTime()
  if (diff < 60000) return 'just now'
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
})

const previewText = computed(() => {
  const tmp = document.createElement('div')
  tmp.innerHTML = props.note.content || ''
  return tmp.textContent?.trim().slice(0, 120) || ''
})
</script>

<template>
  <div
    class="group relative bg-white dark:bg-zinc-800 border rounded-xl p-4 cursor-pointer transition-all hover:shadow-md"
    :class="note.pinned
      ? 'border-violet-300 dark:border-violet-700'
      : 'border-zinc-200 dark:border-zinc-700 hover:border-violet-200 dark:hover:border-violet-800'"
    @click="emit('open', note)"
  >
    <!-- Pin indicator -->
    <UIcon
      v-if="note.pinned"
      name="i-lucide-pin"
      class="absolute top-3 right-3 size-3.5 text-violet-400 rotate-45"
    />

    <!-- Title -->
    <p class="text-sm font-semibold text-zinc-900 dark:text-zinc-100 pr-5 mb-1 line-clamp-1">
      {{ note.title || 'Untitled' }}
    </p>

    <!-- Preview -->
    <p v-if="previewText" class="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-3 mb-3">
      {{ previewText }}
    </p>
    <p v-else class="text-xs text-zinc-400 dark:text-zinc-600 italic mb-3">Empty note</p>

    <!-- Tags -->
    <div v-if="note.tags?.length" class="flex flex-wrap gap-1 mb-2">
      <span
        v-for="tag in note.tags.slice(0, 3)"
        :key="tag"
        class="px-1.5 py-0.5 rounded text-xs bg-zinc-100 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300"
      >
        {{ tag }}
      </span>
    </div>

    <!-- Footer -->
    <div class="flex items-center justify-between">
      <span class="text-xs text-zinc-400">{{ timeAgo }}</span>
      <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <UButton
          :icon="note.pinned ? 'i-lucide-pin-off' : 'i-lucide-pin'"
          color="neutral"
          variant="ghost"
          size="xs"
          @click.stop="emit('pin', note)"
        />
        <UButton
          icon="i-lucide-trash-2"
          color="neutral"
          variant="ghost"
          size="xs"
          @click.stop="emit('delete', note.id)"
        />
      </div>
    </div>
  </div>
</template>

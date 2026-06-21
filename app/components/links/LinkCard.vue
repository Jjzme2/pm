<script setup lang="ts">
import type { QuickLink } from '~/types'

defineProps<{ link: QuickLink }>()
const emit = defineEmits<{
  edit: [link: QuickLink]
  delete: [id: string]
}>()

const colorBg: Record<string, string> = {
  violet: 'bg-violet-100 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400',
  blue: 'bg-blue-100 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400',
  emerald: 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400',
  amber: 'bg-amber-100 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400',
  rose: 'bg-rose-100 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400',
  sky: 'bg-sky-100 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400',
  green: 'bg-green-100 dark:bg-green-950/40 text-green-600 dark:text-green-400',
  orange: 'bg-orange-100 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400',
  pink: 'bg-pink-100 dark:bg-pink-950/40 text-pink-600 dark:text-pink-400',
  indigo: 'bg-indigo-100 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400',
  teal: 'bg-teal-100 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400',
  purple: 'bg-purple-100 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400'
}

function getDomain(url: string) {
  try { return new URL(url).hostname.replace('www.', '') }
  catch { return url }
}
</script>

<template>
  <div class="group relative bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl p-4 hover:border-violet-200 dark:hover:border-violet-800 hover:shadow-sm transition-all">
    <div class="flex items-start gap-3">
      <!-- Icon/favicon -->
      <div class="size-10 rounded-lg flex items-center justify-center flex-shrink-0" :class="colorBg[link.color] || colorBg.violet">
        <span class="text-base font-bold">{{ link.title.charAt(0).toUpperCase() }}</span>
      </div>

      <!-- Content -->
      <div class="flex-1 min-w-0">
        <a
          :href="link.url"
          target="_blank"
          rel="noopener noreferrer"
          class="text-sm font-semibold text-zinc-900 dark:text-zinc-100 hover:text-violet-600 dark:hover:text-violet-400 transition-colors line-clamp-1 block"
          @click.stop
        >
          {{ link.title }}
          <UIcon name="i-lucide-external-link" class="size-3 inline ml-1 opacity-50" />
        </a>
        <p v-if="link.description" class="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-1 mt-0.5">
          {{ link.description }}
        </p>
        <p class="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">{{ getDomain(link.url) }}</p>
      </div>
    </div>

    <!-- Actions -->
    <div class="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
      <UButton
        icon="i-lucide-pencil"
        color="neutral"
        variant="ghost"
        size="xs"
        @click="emit('edit', link)"
      />
      <UButton
        icon="i-lucide-trash-2"
        color="neutral"
        variant="ghost"
        size="xs"
        @click="emit('delete', link.id)"
      />
    </div>
  </div>
</template>

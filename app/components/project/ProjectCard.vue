<script setup lang="ts">
import type { Project } from '~/types'

defineProps<{ project: Project; taskCount?: number; noteCount?: number }>()
const emit = defineEmits<{
  edit: [project: Project]
  delete: [id: string]
}>()

const colorRing: Record<string, string> = {
  violet: 'ring-violet-400/30 dark:ring-violet-500/20',
  blue: 'ring-blue-400/30 dark:ring-blue-500/20',
  emerald: 'ring-emerald-400/30 dark:ring-emerald-500/20',
  amber: 'ring-amber-400/30 dark:ring-amber-500/20',
  rose: 'ring-rose-400/30 dark:ring-rose-500/20',
  sky: 'ring-sky-400/30 dark:ring-sky-500/20',
  green: 'ring-green-400/30 dark:ring-green-500/20',
  orange: 'ring-orange-400/30 dark:ring-orange-500/20',
  pink: 'ring-pink-400/30 dark:ring-pink-500/20',
  indigo: 'ring-indigo-400/30 dark:ring-indigo-500/20',
  teal: 'ring-teal-400/30 dark:ring-teal-500/20',
  purple: 'ring-purple-400/30 dark:ring-purple-500/20'
}

const iconBg: Record<string, string> = {
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
</script>

<template>
  <NuxtLink
    :to="`/projects/${project.id}`"
    class="group relative block bg-white dark:bg-zinc-800 border rounded-xl p-5 hover:shadow-md transition-all ring-1"
    :class="[
      'border-zinc-200 dark:border-zinc-700',
      colorRing[project.color] || colorRing.violet
    ]"
  >
    <div class="flex items-start justify-between gap-3 mb-3">
      <div
        class="size-11 rounded-xl flex items-center justify-center flex-shrink-0"
        :class="iconBg[project.color] || iconBg.violet"
      >
        <UIcon :name="project.icon || 'i-lucide-folder'" class="size-5" />
      </div>
      <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <UButton
          icon="i-lucide-pencil"
          color="neutral"
          variant="ghost"
          size="xs"
          @click.prevent="emit('edit', project)"
        />
        <UButton
          icon="i-lucide-trash-2"
          color="neutral"
          variant="ghost"
          size="xs"
          @click.prevent="emit('delete', project.id)"
        />
      </div>
    </div>

    <h3 class="text-base font-semibold text-zinc-900 dark:text-zinc-100 mb-1">{{ project.name }}</h3>
    <p v-if="project.description" class="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-2 mb-3">
      {{ project.description }}
    </p>

    <div class="flex items-center gap-3 text-xs text-zinc-400">
      <span v-if="taskCount !== undefined" class="flex items-center gap-1">
        <UIcon name="i-lucide-check-square" class="size-3.5" />
        {{ taskCount }} tasks
      </span>
      <span v-if="noteCount !== undefined" class="flex items-center gap-1">
        <UIcon name="i-lucide-notebook" class="size-3.5" />
        {{ noteCount }} notes
      </span>
    </div>
  </NuxtLink>
</template>

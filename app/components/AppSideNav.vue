<script setup lang="ts">
const route = useRoute()
const config = useRuntimeConfig()
const { projects } = useProjects()

const navItems = [
  { label: 'Dashboard', icon: 'i-lucide-layout-dashboard', to: '/' },
  { label: 'Projects', icon: 'i-lucide-folder-kanban', to: '/projects' },
  { label: 'Notes', icon: 'i-lucide-notebook-pen', to: '/notes' },
  { label: 'Timers', icon: 'i-lucide-timer', to: '/timers' },
  { label: 'Quick Links', icon: 'i-lucide-link', to: '/links' }
]

const colorMap: Record<string, string> = {
  violet: 'text-violet-500',
  blue: 'text-blue-500',
  emerald: 'text-emerald-500',
  amber: 'text-amber-500',
  rose: 'text-rose-500',
  sky: 'text-sky-500',
  green: 'text-green-500',
  orange: 'text-orange-500',
  purple: 'text-purple-500',
  teal: 'text-teal-500',
  pink: 'text-pink-500',
  indigo: 'text-indigo-500',
  lime: 'text-lime-500',
  red: 'text-red-500',
  cyan: 'text-cyan-500',
  fuchsia: 'text-fuchsia-500'
}

const isActive = (path: string) => {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}
</script>

<template>
  <aside class="w-60 flex-shrink-0 border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex flex-col h-full">
    <!-- Logo -->
    <div class="h-14 flex items-center px-4 border-b border-zinc-200 dark:border-zinc-800 flex-shrink-0">
      <NuxtLink to="/" class="flex items-center gap-2.5">
        <UIcon name="i-lucide-folder-kanban" class="size-5 text-violet-500" />
        <span class="font-semibold tracking-tight">ILYTAT PM</span>
      </NuxtLink>
    </div>

    <!-- Main nav -->
    <nav class="flex-1 overflow-y-auto scrollbar-thin py-3 px-2">
      <ul class="space-y-0.5">
        <li v-for="item in navItems" :key="item.to">
          <NuxtLink
            :to="item.to"
            class="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
            :class="isActive(item.to)
              ? 'bg-violet-50 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400'
              : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100'"
          >
            <UIcon :name="item.icon" class="size-4 flex-shrink-0" />
            {{ item.label }}
          </NuxtLink>
        </li>
      </ul>

      <!-- Projects section -->
      <div v-if="projects && projects.length" class="mt-4">
        <p class="px-3 py-1 text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
          Projects
        </p>
        <ul class="mt-1 space-y-0.5">
          <li v-for="project in projects" :key="project.id">
            <NuxtLink
              :to="`/projects/${project.id}`"
              class="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors"
              :class="route.path.startsWith(`/projects/${project.id}`)
                ? 'bg-violet-50 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400 font-medium'
                : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100'"
            >
              <UIcon
                :name="project.icon || 'i-lucide-folder'"
                class="size-4 flex-shrink-0"
                :class="colorMap[project.color] || 'text-zinc-400'"
              />
              <span class="truncate">{{ project.name }}</span>
            </NuxtLink>
          </li>
        </ul>
      </div>
    </nav>

    <!-- Back to hub -->
    <div class="p-2 border-t border-zinc-200 dark:border-zinc-800 flex-shrink-0">
      <a
        :href="config.public.hubUrl"
        target="_blank"
        class="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
      >
        <UIcon name="i-lucide-layout-grid" class="size-4 flex-shrink-0" />
        Back to Hub
        <UIcon name="i-lucide-external-link" class="size-3 ml-auto flex-shrink-0 opacity-50" />
      </a>
    </div>
  </aside>
</template>

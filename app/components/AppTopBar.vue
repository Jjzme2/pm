<script setup lang="ts">
const store = useAuthStore()
const { logout } = useAuth()
const router = useRouter()
const timerStore = useTimerStore()
const sidebar = useSidebar()

async function signOut() {
  await logout()
  router.push('/auth/login')
}
</script>

<template>
  <header class="h-14 shrink-0 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex items-center px-4 gap-2">
    <!-- Hamburger (mobile only) -->
    <UButton
      class="lg:hidden shrink-0"
      icon="i-lucide-menu"
      color="neutral"
      variant="ghost"
      size="sm"
      aria-label="Open menu"
      @click="sidebar.toggle()"
    />

    <!-- Active timer pill -->
    <div class="flex-1 min-w-0">
      <TimerActivePill v-if="timerStore.active" />
    </div>

    <!-- Right actions -->
    <div class="flex items-center gap-1 shrink-0">
      <UColorModeButton size="sm" />

      <UTooltip v-if="store.currentUser" :text="store.currentUser.displayName || store.currentUser.email || 'Account'">
        <UAvatar
          :alt="store.currentUser.displayName || store.currentUser.email || '?'"
          size="xs"
          class="cursor-pointer"
        />
      </UTooltip>

      <UButton
        icon="i-lucide-log-out"
        color="neutral"
        variant="ghost"
        size="sm"
        aria-label="Sign out"
        @click="signOut"
      />
    </div>
  </header>
</template>

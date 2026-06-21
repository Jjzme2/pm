import { defineStore } from 'pinia'
import type { ActiveTimer } from '~/types'

const STORAGE_KEY = 'pm_active_timer'

export const useTimerStore = defineStore('timer', () => {
  const active = ref<ActiveTimer | null>(null)
  const elapsed = ref(0)
  let interval: ReturnType<typeof setInterval> | null = null

  function load() {
    if (import.meta.client) {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        try {
          active.value = JSON.parse(raw)
          startTick()
        } catch {
          localStorage.removeItem(STORAGE_KEY)
        }
      }
    }
  }

  function save() {
    if (import.meta.client) {
      if (active.value) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(active.value))
      } else {
        localStorage.removeItem(STORAGE_KEY)
      }
    }
  }

  function startTick() {
    if (interval) clearInterval(interval)
    interval = setInterval(() => {
      if (active.value) {
        elapsed.value = Date.now() - active.value.startTime
      }
    }, 1000)
  }

  function start(timer: ActiveTimer) {
    active.value = timer
    elapsed.value = 0
    save()
    startTick()
  }

  function stop() {
    const snapshot = active.value ? { ...active.value } : null
    if (interval) { clearInterval(interval); interval = null }
    active.value = null
    elapsed.value = 0
    save()
    return snapshot
  }

  const formattedElapsed = computed(() => {
    const s = Math.floor(elapsed.value / 1000)
    const h = Math.floor(s / 3600)
    const m = Math.floor((s % 3600) / 60)
    const sec = s % 60
    if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
    return `${m}:${String(sec).padStart(2, '0')}`
  })

  return { active, elapsed, formattedElapsed, load, start, stop }
})

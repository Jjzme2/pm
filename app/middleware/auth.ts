export default defineNuxtRouteMiddleware(async (to) => {
  if (to.path.startsWith('/auth')) return

  const user = useCurrentUser()

  if (user.value === undefined) {
    await new Promise<void>(resolve => {
      const stop = watch(user, val => {
        if (val !== undefined) { stop(); resolve() }
      })
    })
  }

  if (!user.value) {
    const config = useRuntimeConfig()
    const redirect = encodeURIComponent(window.location.origin + to.fullPath)
    const hubLogin = `${config.public.hubUrl}/auth/login?redirect=${redirect}`
    return navigateTo(hubLogin, { external: true })
  }
})

export default defineNuxtPlugin(() => {
  const globalFetch = $fetch.create({
    onResponseError({ response }) {
      if (response.status === 401) {
        navigateTo('/login')
      }
    }
  })

  return {
    provide: {
      api: globalFetch
    }
  }
})
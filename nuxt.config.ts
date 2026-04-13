import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: '2026-04-13',
  devtools: {
    enabled: true,

    timeline: {
      enabled: true
    }
  },

  css: ['./app/assets/css/main.css'],

  modules: [
    '@nuxt/a11y',
    '@nuxt/fonts',
    '@nuxt/icon',
    '@nuxt/image',
    '@nuxtjs/color-mode',
  ],

  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
})

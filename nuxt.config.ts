import tailwindcss from "@tailwindcss/vite";

const authEnabled = process.env.AUTH_ENABLED !== "false";

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

  runtimeConfig: {
    auth: {
      enabled: true,
      secret: process.env.AUTH_SECRET ?? "change-this-secret-in-production",
      cookieName: "gm_auth_token",
      adminEmail: process.env.AUTH_ADMIN_EMAIL ?? "admin@admin.com",
      adminPassword: process.env.AUTH_ADMIN_PASSWORD ?? "123",
      sessionTtlSeconds: 60 * 60 * 24 * 7,
    },
  },
})

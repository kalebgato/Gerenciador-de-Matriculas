import tailwindcss from "@tailwindcss/vite";

// Altere aqui para habilitar ou desabilitar autenticacao no build.
// Nao use variavel de ambiente para esse toggle.
const AUTH_ENABLED = true;

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
      enabled: AUTH_ENABLED,
      secret: process.env.AUTH_SECRET ?? "change-this-secret-in-production",
      cookieName: "gm_auth_token",
      adminEmail: process.env.AUTH_ADMIN_EMAIL ?? "admin@admin.com",
      adminPassword: process.env.AUTH_ADMIN_PASSWORD ?? "123",
      sessionTtlSeconds: 60 * 60 * 24 * 7,
    },
    public: {
      authEnabled: AUTH_ENABLED,
    },
  },
})

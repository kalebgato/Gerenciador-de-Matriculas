import tailwindcss from "@tailwindcss/vite";

// Altere aqui para habilitar ou desabilitar autenticacao no build.
// Nao use variavel de ambiente para esse toggle.
const AUTH_ENABLED = true;

const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="#c62828"/><text x="50" y="68" font-size="58" font-family="Arial, sans-serif" font-weight="bold" fill="white" text-anchor="middle">P</text></svg>`;

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: '2026-04-13',
  devtools: {
    enabled: true,

    timeline: {
      enabled: true
    }
  },

  app: {
    head: {
      htmlAttrs: {
        lang: 'pt-BR'
      },
      titleTemplate: (titleChunk) => titleChunk ? `${titleChunk} · PRODAGIN` : 'PRODAGIN',
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: `data:image/svg+xml,${encodeURIComponent(faviconSvg)}` }
      ]
    }
  },

  css: ['~/assets/css/main.css', '~/assets/css/dark-mode.css'],

  modules: [
    '@nuxt/a11y',
    '@nuxt/fonts',
    '@nuxt/icon',
    '@nuxt/image',
    '@nuxtjs/color-mode',
  ],

  colorMode: {
    classPrefix: '',
    classSuffix: '',
    preference: 'system',
    fallback: 'light',
    storageKey: 'prodagin-color-mode',
  },

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
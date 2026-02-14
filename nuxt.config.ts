// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  ssr: true,
  modules: ['@nuxt/ui', 'nuxt-auth-utils', '@pinia/nuxt', '@nuxtjs/seo', 'nuxt-security', '@vite-pwa/nuxt'],
   css: ['./app/assets/css/main.css'],

   pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: 'The Covenant Academy',
      short_name: 'TCAD',
      description: 'The Covenant Academy Parent Portal',
      theme_color: '#09033B',
      background_color: '#09033B',
      display: 'standalone',
      orientation: 'portrait',
      start_url: '/portal/login', // Handles the redirect logic we discussed
      icons: [
        {
          src: 'pwa-192.png',
          sizes: '192x192',
          type: 'image/png'
        },
        {
          src: 'pwa-512.png',
          sizes: '512x512',
          type: 'image/png'
        },
        {
          src: 'pwa-512.png', // Re-using the 512 icon for "maskable" is standard practice
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any maskable'
        }
      ]
    },
    workbox: {
      navigateFallback: '/',
      globPatterns: ['**/*.{js,css,html,png,svg,ico}'],
    },
    devOptions: {
      enabled: true,
      type: 'module',
    },
  },

   // TCAD Branding Colors (from our previous notes)
  app: {
    head: {
      title: 'The Covenant Academy MIS',
      link: [
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
        { rel: 'icon', type: 'image/png', sizes: '192x192', href: '/pwa-192.png' } // Fallback
      ],
      meta: [
        { name: 'theme-color', content: '#09033B' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' }
      ]
    }
  },
  security: {
    headers: {
      contentSecurityPolicy: {
        'img-src': ["'self'", 'data:', 'https://res.cloudinary.com'],
      },
      crossOriginEmbedderPolicy: 'unsafe-none', // Necessary for some image loading scenarios
    },
    // Protect specific routes with stricter rules
    requestSizeLimiter: {
      maxUploadSize: 2 * 1024 * 1024, // Match your 2MB Cloudinary limit
    }
  },

  nitro: {
    preset: 'netlify',
    compressPublicAssets: true,
    minify: true
  },

  ogImage: {
    enabled: true,
    host: process.env.NUXT_PUBLIC_SITE_URL || 'https://mis.thecovenantacademy.org',
    domains: [
      'res.cloudinary.com',
    ],
  },

  runtimeConfig: {
    // Private keys (server-side only)
    JWT_SECRET: process.env.JWT_SECRET,
    tidbHost: process.env.TIDB_HOST,
    tidbUser: process.env.TIDB_USER,
    tidbPassword: process.env.TIDB_PASSWORD,
    tidbDatabase: process.env.TIDB_DATABASE,
    databaseUrl: process.env.DATABASE_URL
  },
   
    vite: {
    plugins: [
      tailwindcss(),
    ],
  },
})
// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  ssr: true,
  modules: ['@nuxt/ui', 'nuxt-auth-utils', '@pinia/nuxt', '@nuxtjs/seo', 'nuxt-security'],
   css: ['./app/assets/css/main.css'],

   // TCAD Branding Colors (from our previous notes)
  app: {
    head: {
      title: 'The Covenant Academy MIS',
      meta: [
        { name: 'theme-color', content: '#09033B' } 
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
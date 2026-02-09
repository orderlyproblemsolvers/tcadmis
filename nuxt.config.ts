// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  ssr: true,
  modules: ['@nuxt/ui', 'nuxt-auth-utils', '@pinia/nuxt', '@nuxtjs/seo'],
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
// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  ssr: true,
  modules: ['@nuxt/ui', 'nuxt-auth-utils', '@pinia/nuxt'],
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

  // ogImage: {
  //   enabled: true,
  //   host: process.env.NUXT_PUBLIC_SITE_URL || 'https://mis.thecovenantacademy.org',
  //   domains: [
  //     'res.cloudinary.com',
  //   ],
  // },

  image: {
    provider: 'cloudinary',
    cloudinary: { baseURL: 'https://res.cloudinary.com/...' },
    domains: [
      'images.unsplash.com',
      'i.pravatar.cc',
      'res.cloudinary.com',
      'mis.thecovenanacademy.org',
      'mis.thecovenantacademy.netlify.app',
      process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000'
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

<script setup lang="ts">
// components/OgImage/TcadMis.vue
defineProps({
  title: {
    type: String,
    required: true,
    default: 'Management Information System'
  },
  subtitle: {
    type: String,
    default: 'The Covenant Academy • Excellence in Godly Education'
  },
  label: {
    type: String,
    default: 'STAFF PORTAL'
  }
})
</script>

<template>
  <div class="w-full h-full flex flex-col items-center justify-center relative p-20" 
       style="background: linear-gradient(135deg, #09033B 0%, #0e0459 100%);">
    
    <div class="absolute top-0 right-0 w-64 h-64 opacity-10" 
         style="background: radial-gradient(circle, #ffffff 0%, transparent 70%); transform: translate(30%, -30%);"></div>
    
    <div class="mb-8 px-6 py-2 rounded-full border-2 border-[#dbeafe]/30" 
         style="background-color: rgba(219, 234, 254, 0.1);">
      <span class="text-[#dbeafe] font-bold tracking-[0.2em]" style="font-size: 24px;">
        {{ label.toUpperCase() }}
      </span>
    </div>

    <div class="flex flex-col items-center text-center">
      <img 
        src="/img/logo.png" 
        alt="TCAD Logo" 
        class="mb-10"
        style="height: 180px; width: 180px; object-fit: contain; filter: drop-shadow(0 10px 15px rgba(0,0,0,0.3));"
      />

      <h1 class="text-white mb-6 font-black uppercase tracking-tight" 
          style="font-size: 84px; line-height: 1; font-family: 'EB Garamond', serif;">
        {{ title }}
      </h1>
      
      <div class="h-1 w-32 bg-[#dbeafe] mb-8 opacity-50"></div>

      <p class="px-24 italic" 
         style="font-size: 34px; color: #dbeafe; font-weight: 500; font-family: 'EB Garamond', serif;">
        {{ subtitle }}
      </p>
    </div>

    <div class="absolute bottom-12 w-full flex justify-center opacity-40">
      <p class="text-white text-sm tracking-widest uppercase" style="font-size: 18px;">
        the school of tomorrow
      </p>
    </div>
  </div>
</template>

<style scoped>
/* Ensure EB Garamond is available for the OG generator */
@import url('https://fonts.googleapis.com/css2?family=EB+Garamond:wght@400;800&display=swap');
</style>
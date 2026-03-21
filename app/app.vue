<template>
  <div>
    <NuxtLoadingIndicator :height="4" color="#cc5500"/>
    <VitePwaManifest />

    <Transition name="slide-down">
      <div v-if="!isOnline" class="network-banner offline">
        You are currently offline. Please check your internet connection.
      </div>

      <div v-else-if="isUnstable" class="network-banner unstable">
        Your internet connection is slow or unstable.
      </div>
    </Transition>

    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useNetwork } from '@vueuse/core'

const { isOnline, effectiveType } = useNetwork()

const isUnstable = computed(() => {
  return isOnline.value && ['slow-2g', '2g'].includes(effectiveType.value)
})
</script>

<style scoped>
/* Base Banner Styles */
.network-banner {
  text-align: center;
  padding: 10px;
  font-size: 14px;
  font-weight: 500;
  position: sticky; /* Keeps it at the top of the screen */
  top: 0;
  z-index: 9999;
  width: 100%;
}

.offline {
  background-color: #dc3545; /* Red */
  color: white;
}

.unstable {
  background-color: #ffc107; /* Yellow */
  color: #333;
}

/* --- Transition Animations --- */

/* 1. Define the speed and easing of the animation */
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1); /* Smooth snap */
}

/* 2. Define where the element starts before entering, and ends after leaving */
.slide-down-enter-from,
.slide-down-leave-to {
  transform: translateY(-100%); /* Hides it above the screen */
  opacity: 0;
}
</style>
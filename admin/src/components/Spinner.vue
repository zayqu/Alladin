<template>
  <div v-if="loading" class="loading-overlay">
    <div class="spinner-container">
      <div class="spinner">
        <div class="spinner__circle"></div>
        <div class="spinner__circle spinner__circle--inner"></div>
      </div>
      <p class="loading-text">Best sururu</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useLoadingStore } from "@/stores/loading";

const loadingStore = useLoadingStore();
const loading = computed(() => loadingStore.loading);
</script>

<style scoped>
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  backdrop-filter: blur(8px);
  background: rgba(255, 255, 255, 0.55);
}

.dark .loading-overlay {
  background: rgba(9, 9, 11, 0.55); /* zinc-950 */
}

.spinner-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.25rem;
  padding: 1.25rem 1.5rem;
  border-radius: 1rem;
  background: rgba(255, 255, 255, 0.75);
  border: 1px solid rgba(228, 228, 231, 0.7); /* zinc-200 */
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.12);
}

.dark .spinner-container {
  background: rgba(24, 24, 27, 0.7); /* zinc-900 */
  border: 1px solid rgba(63, 63, 70, 0.7); /* zinc-700 */
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.45);
}

.spinner {
  position: relative;
  width: 64px;
  height: 64px;
}

.spinner__circle {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 3px solid transparent;
  border-top-color: #f59e0b; /* amber-500 (brand) */
  filter: drop-shadow(0 0 10px rgba(245, 158, 11, 0.25));
  animation: spin 1s cubic-bezier(0.68, -0.55, 0.27, 1.55) infinite;
}

.spinner__circle--inner {
  width: 70%;
  height: 70%;
  top: 15%;
  left: 15%;
  border-top-color: #fb923c; /* orange-400 (logo warmth) */
  filter: drop-shadow(0 0 10px rgba(251, 146, 60, 0.25));
  animation: spin 0.8s cubic-bezier(0.68, -0.55, 0.27, 1.55) infinite reverse;
}

.loading-text {
  font-size: 0.9rem;
  font-weight: 700;
  color: #18181b; /* zinc-900 */
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.dark .loading-text {
  color: #f4f4f5; /* zinc-100 */
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>

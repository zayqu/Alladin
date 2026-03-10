<template>
  <div :class="{ dark: darkMode }">
    <div
      class="h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200 flex items-center justify-center p-4"
    >
      <div class="w-full">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, provide } from "vue";
import { SunIcon, MoonIcon } from "@heroicons/vue/24/outline";

const darkMode = ref(false);

const toggleDarkMode = () => {
  darkMode.value = !darkMode.value;
  localStorage.setItem("darkMode", darkMode.value);
  updateDarkModeClass();
};

const updateDarkModeClass = () => {
  if (darkMode.value) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
};

// Initialize dark mode
onMounted(() => {
  // Check if user has a preference stored
  const storedPreference = localStorage.getItem("darkMode");

  if (storedPreference !== null) {
    // Use stored preference if exists
    darkMode.value = storedPreference === "true";
  } else {
    // Otherwise use system preference
    const systemPrefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    darkMode.value = systemPrefersDark;
  }

  updateDarkModeClass();

  // Watch for system preference changes (only if no user preference is set)
  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  const handleSystemPreferenceChange = (e) => {
    if (localStorage.getItem("darkMode") === null) {
      darkMode.value = e.matches;
      updateDarkModeClass();
    }
  };

  mediaQuery.addEventListener("change", handleSystemPreferenceChange);

  // Cleanup listener when component unmounts
  return () => {
    mediaQuery.removeEventListener("change", handleSystemPreferenceChange);
  };
});

provide("darkMode", darkMode);
</script>

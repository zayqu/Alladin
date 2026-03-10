<template>
  <div :class="{ dark: darkMode }">
    <div
      class="h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200 flex"
    >
      <!-- Mobile sidebar backdrop (only shows on mobile when sidebar is open) -->
      <div
        v-if="isSidebarOpen"
        @click="toggleSidebar"
        class="fixed inset-0 z-30 bg-black bg-opacity-50 md:hidden"
      ></div>

      <!-- Sidebar -->
      <Sidebar
        :is-sidebar-open="isSidebarOpen"
        @toggle-sidebar="toggleSidebar"
        @logout="handleLogout"
      />

      <!-- Main content area -->
      <div class="flex-1 flex flex-col min-w-0">
        <!-- Navbar -->
        <Navbar
          :user="user"
          :is-mobile-sidebar-open="isSidebarOpen"
          @toggle-sidebar="toggleSidebar"
          @logout="handleLogout"
          @toggle-dark-mode="toggleDarkMode"
        />

        <!-- Main content -->
        <main class="flex-1 overflow-y-auto focus:outline-none">
          <div class="p-4 sm:p-6">
            <router-view />
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, provide, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import Sidebar from "@/components/Sidebar.vue";
import Navbar from "@/components/Navbar.vue";

const route = useRoute();
const isSidebarOpen = ref(false);
const darkMode = ref(false);
const user = ref({
  name: "John Doe",
  email: "john@example.com",
  avatar:
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
});

// Auto-close sidebar on mobile when route changes
watch(
  () => route.path,
  () => {
    if (window.innerWidth < 768) {
      isSidebarOpen.value = false;
    }
  }
);

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

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

const handleLogout = () => {
  console.log("User logged out");
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

<template>
  <header
    class="sticky top-0 z-20 border-b bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700"
  >
    <div class="flex items-center justify-between px-4 py-4">
      <div class="flex items-center">
        <button
          @click="toggleSidebar"
          class="p-2 mr-2 rounded-md focus:outline-none md:hidden text-gray-500 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          <svg
            class="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        <h1
          class="text-xl font-semibold truncate text-gray-800 dark:text-white"
        >
          {{ currentRouteName }}
        </h1>
      </div>

      <div class="flex items-center space-x-3 sm:space-x-4">
        <!-- Dark/Light Mode Toggle -->
        <button
          @click="toggleDarkMode"
          class="p-2 rounded-full focus:outline-none bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600"
          aria-label="Toggle dark mode"
        >
          <svg
            v-if="isDarkMode"
            class="w-5 h-5 text-yellow-300"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
            />
          </svg>
          <svg
            v-else
            class="w-5 h-5 text-gray-700 dark:text-gray-300"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fill-rule="evenodd"
              d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
              clip-rule="evenodd"
            />
          </svg>
        </button>

        <div class="relative">
          <button
            @click="toggleUserDropdown"
            class="flex items-center focus:outline-none"
            aria-label="User menu"
          >
            <!-- <img
              :src="user.avatar"
              alt="User avatar"
              class="w-8 h-8 rounded-full object-cover"
            /> -->
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="size-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
              />
            </svg>
          </button>

          <div
            v-if="isUserDropdownOpen"
            class="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 z-50 bg-white dark:bg-gray-800"
          >
            <button
              @click="logout"
              class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, inject } from "vue";
import { useRouter } from "vue-router";

const props = defineProps({
  user: Object,
  isMobileSidebarOpen: Boolean,
});

const emit = defineEmits(["logout", "toggle-dark-mode", "toggle-sidebar"]);

const router = useRouter();
const isUserDropdownOpen = ref(false);
const darkMode = inject("darkMode", ref(false));

const isDarkMode = computed(() => darkMode.value);

const currentRouteName = computed(() => {
  return router.currentRoute.value.name || "Dashboard";
});

const toggleUserDropdown = () => {
  isUserDropdownOpen.value = !isUserDropdownOpen.value;
};

const toggleDarkMode = () => {
  emit("toggle-dark-mode");
};

const toggleSidebar = () => {
  emit("toggle-sidebar");
};

const logout = () => {
  emit("logout");
  isUserDropdownOpen.value = false;
};

// Close dropdown when clicking outside
const handleClickOutside = (event) => {
  if (!event.target.closest(".relative")) {
    isUserDropdownOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>

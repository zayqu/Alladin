<template>
  <aside
    class="fixed h-screen md:relative inset-y-0 left-0 z-40 w-64 transition-all duration-300 ease-in-out transform bg-gradient-to-b from-zinc-950 to-zinc-900 text-white shadow-xl"
    :class="{
      'translate-x-0': isSidebarOpen,
      '-translate-x-full md:translate-x-0': !isSidebarOpen,
    }"
  >
    <div class="flex flex-col h-full">
      <!-- Logo/Brand -->
      <div
        class="flex items-center justify-between p-4 border-b border-zinc-800"
      >
        <router-link to="/dashboard" class="flex items-center space-x-2 p-0.5">
          <img src="/logo.png" alt="Logo" class="h-8 w-8 object-contain" />

          <span class="text-xl font-bold whitespace-nowrap">Best Sururu</span>
        </router-link>
        <button
          @click="toggleSidebar"
          class="p-1 rounded-md focus:outline-none md:hidden hover:bg-amber-500/15 transition-colors"
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
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 overflow-y-auto py-4 px-2">
        <div class="space-y-1">
          <template v-for="menu in menus" :key="menu.id">
            <!-- Case 1: menu with no submenus -->
            <router-link
              v-if="!menu.submenus.length"
              :to="menu.menu_path"
              class="flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 mb-2"
              :class="{
                'bg-amber-500/20 text-white shadow-md border border-amber-400/20':
                  $route.path === menu.menu_path,
                'hover:bg-white/5 text-white': $route.path !== menu.menu_path,
              }"
            >
              <component
                :is="menu.menu_icon"
                class="w-5 h-5 mr-3 text-amber-300"
                v-if="menu.menu_icon"
              />
              <span>{{ menu.menu_name }}</span>
            </router-link>

            <!-- Case 2: menu with submenus (dropdown) -->
            <div v-else>
              <button
                @click="toggleDropdown(menu.id)"
                class="w-full flex items-center justify-between px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200"
                :class="{
                  'bg-amber-500/20 text-white border border-amber-400/20':
                    activeDropdown === menu.id,
                  'hover:bg-white/5 text-white': activeDropdown !== menu.id,
                }"
              >
                <div class="flex items-center">
                  <component
                    :is="menu.menu_icon"
                    class="w-5 h-5 mr-3 text-amber-300"
                    v-if="menu.menu_icon"
                  />
                  <span>{{ menu.menu_name }}</span>
                </div>
                <svg
                  class="w-4 h-4 transition-transform duration-200 text-amber-200"
                  :class="{ 'rotate-180': activeDropdown === menu.id }"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              <transition
                enter-active-class="transition-all duration-200 ease-out"
                enter-from-class="transform opacity-0 max-h-0"
                enter-to-class="transform opacity-100 max-h-96"
                leave-active-class="transition-all duration-150 ease-in"
                leave-from-class="transform opacity-100 max-h-96"
                leave-to-class="transform opacity-0 max-h-0"
              >
                <div
                  v-show="activeDropdown === menu.id"
                  class="ml-8 mt-1 space-y-1 overflow-hidden"
                >
                  <router-link
                    v-for="sub in menu.submenus"
                    :key="sub.id"
                    :to="sub.submenu_path"
                    class="flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200"
                    :class="{
                      'bg-amber-500/15 text-white border border-amber-400/10':
                        $route.path === sub.submenu_path,
                      'hover:bg-white/5 text-zinc-200':
                        $route.path !== sub.submenu_path,
                    }"
                    active-class="bg-amber-500/15"
                  >
                    <component
                      :is="sub.submenu_icon"
                      class="w-4 h-4 mr-3 text-amber-300"
                      v-if="sub.submenu_icon"
                    />
                    {{ sub.submenu_name }}
                  </router-link>
                </div>
              </transition>
            </div>
          </template>
        </div>
      </nav>

      <!-- User & Logout -->
      <div class="p-4 border-t border-zinc-800">
        <button
          @click="userStore.signout"
          class="w-full cursor-pointer flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow hover:shadow-md"
        >
          <svg
            class="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          Sign Out
        </button>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import * as Icons from "@heroicons/vue/24/outline";
import axios from "axios";

import { useUserStore } from "@/stores/userStore";
import { API_BASE_URL } from "@/hooks/config";
import { useAxiosError } from "@/hooks/axiosError";

const userStore = useUserStore();
const { handleAxiosError } = useAxiosError();

const props = defineProps({
  isSidebarOpen: Boolean,
});

const emit = defineEmits(["toggle-sidebar"]);

const activeDropdown = ref("");

// fetched menus from backend
const rawMenus = ref([]);

/**
 * Fetch menus allowed for logged-in user using user_rights -> menus JOIN
 */
const fetchSidebarMenus = async () => {
  try {
    const url = `${API_BASE_URL}/getMySidebarMenus`;
    const res = await axios.get(url, {
      headers: { Authorization: `Bearer ${userStore.token}` },
    });

    const list = Array.isArray(res.data.menus) ? res.data.menus : [];

    // normalize to your UI naming used in template
    rawMenus.value = list.map((m) => ({
      id: m.id,
      menu_name: m.name,
      menu_icon: m.icon, // string like "HomeIcon"
      menu_path: m.path,
      submenus: [], // you said none for now
    }));
  } catch (e) {
    handleAxiosError(e);
    rawMenus.value = []; // fail-safe: no menus
  }
};

// Convert icon strings to real icon components
const menus = computed(() => {
  return rawMenus.value.map((menu) => ({
    ...menu,
    menu_icon: Icons[menu.menu_icon] || null,
    submenus: (menu.submenus || []).map((sub) => ({
      ...sub,
      submenu_icon: (sub.submenu_icon && Icons[sub.submenu_icon]) || null,
    })),
  }));
});

const toggleDropdown = (dropdown) => {
  activeDropdown.value = activeDropdown.value === dropdown ? "" : dropdown;
};

const toggleSidebar = () => {
  emit("toggle-sidebar");
};

onMounted(() => {
  fetchSidebarMenus();
});
</script>

<template>
  <div class="flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <!-- Header -->
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <div class="flex justify-center">
        <div class="h-12 w-12 rounded-full flex items-center justify-center">
          <img
            src="/logo.png"
            alt="Logo"
            class="object-contain w-full h-full"
          />
        </div>
      </div>
      <h2
        class="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900 dark:text-white"
      >
        Welcome Back
      </h2>
      <p class="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
        Sign in to your dashboard
      </p>
    </div>

    <!-- Login Form -->
    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div
        class="bg-white dark:bg-gray-800 py-8 px-4 shadow-lg rounded-lg sm:px-10"
      >
        <!-- Error Alert -->
        <div
          v-if="errorMessage"
          class="mb-6 p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
        >
          <div class="flex items-center">
            <ExclamationTriangleIcon
              class="h-5 w-5 text-red-600 dark:text-red-400 mr-3"
            />
            <p class="text-red-800 dark:text-red-300 text-sm">
              {{ errorMessage }}
            </p>
          </div>
        </div>

        <form class="space-y-6" @submit.prevent="handleLogin">
          <!-- Email -->
          <div>
            <label
              for="email"
              class="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Email Address
            </label>
            <div class="mt-1">
              <input
                v-model="form.email"
                id="email"
                name="email"
                type="email"
                required
                autocomplete="email"
                class="block w-full px-3 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-amber-500 focus:outline-none transition-all bg-white border-gray-300 text-gray-900 placeholder-gray-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                placeholder="Enter your email"
              />
            </div>
          </div>

          <!-- Password -->
          <div>
            <label
              for="password"
              class="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Password
            </label>
            <div class="mt-1 relative">
              <input
                v-model="form.password"
                id="password"
                name="password"
                :type="showPassword ? 'text' : 'password'"
                required
                autocomplete="current-password"
                class="block w-full px-3 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-amber-500 focus:outline-none transition-all bg-white border-gray-300 text-gray-900 placeholder-gray-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 pr-10"
                placeholder="Enter your password"
              />
              <button
                type="button"
                @click="togglePasswordVisibility"
                class="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <EyeIcon v-if="showPassword" class="h-5 w-5 text-gray-400" />
                <EyeSlashIcon v-else class="h-5 w-5 text-gray-400" />
              </button>
            </div>
          </div>

          <!-- Remember Me Checkbox -->
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input
                v-model="form.rememberMe"
                id="remember-me"
                name="remember-me"
                type="checkbox"
                class="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
              />
              <label
                for="remember-me"
                class="ml-2 block text-sm text-gray-700 dark:text-gray-300"
              >
                Remember me
              </label>
            </div>

            <!-- Forgot Password Link -->
            <div class="text-sm">
              <a
                href="#"
                class="font-medium text-amber-600 dark:text-amber-400 hover:text-amber-500"
              >
                Forgot your password?
              </a>
            </div>
          </div>

          <!-- Submit Button -->
          <div>
            <button
              type="submit"
              :disabled="isLoading"
              class="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <span v-if="isLoading">
                <ArrowPathIcon class="h-5 w-5 animate-spin mr-2 inline" />
                Signing in...
              </span>
              <span v-else> Sign in </span>
            </button>
          </div>
        </form>

        <!-- Footer -->
        <div class="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <p class="text-xs text-center text-gray-500 dark:text-gray-400">
            &copy; {{ new Date().getFullYear() }} Admin Dashboard. All rights
            reserved.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/userStore";
import {
  EyeIcon,
  EyeSlashIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon,
} from "@heroicons/vue/24/outline";

const router = useRouter();
const userStore = useUserStore();

// Form state
const form = reactive({
  email: "",
  password: "",
});

// UI state
const isLoading = ref(false);
const errorMessage = ref("");
const showPassword = ref(false);

// Toggle password visibility
const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};

// Email validation
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Handle login
const handleLogin = async () => {
  // Basic validation
  if (!form.email.trim() || !form.password.trim()) {
    errorMessage.value = "Please enter both email and password";
    return;
  }

  // Email validation
  if (!isValidEmail(form.email.trim())) {
    errorMessage.value = "Please enter a valid email address";
    return;
  }

  // Trim whitespace
  const email = form.email.trim().toLowerCase();
  const password = form.password.trim();

  await userStore.signIn({
    email: email,
    password: password,
  });
};
</script>

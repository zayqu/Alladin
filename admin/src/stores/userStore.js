// stores/userStore.js
import { ref } from "vue";
import { defineStore } from "pinia";
import { API_BASE_URL } from "@/hooks/config";
import axios from "axios";
import { useLoadingStore } from "./loading";
import { useToast } from "@/hooks/toast";
import { useRouter } from "vue-router";
import { useAxiosError } from "@/hooks/axiosError";

export const useUserStore = defineStore(
  "userStore",
  () => {
    const user = ref(null);
    const token = ref(null);
    const loading = useLoadingStore();
    const { showToast } = useToast();
    const { handleAxiosError } = useAxiosError();
    const router = useRouter();

    const signIn = async ({ email, password }) => {
      try {
        loading.setLoading(true);
        const url = `${API_BASE_URL}/signin`;
        console.log("Signing in with URL:", url);
        const response = await axios.post(
          url,
          { email, password },
          { headers: { "Content-Type": "application/json" } }
        );

        // Store user and token
        user.value = response.data.user;
        token.value = response.data.token;

        showToast(response.data.message, "success");
        router.push("/dashboard");

        return response.data;
      } catch (error) {
        handleAxiosError(error);
      } finally {
        loading.setLoading(false);
      }
    };

    const signout = async () => {
      try {
        // Clear local state
        user.value = null;
        token.value = null;

        // Remove token from axios defaults
        delete axios.defaults.headers.common["Authorization"];

        // Clear persisted data
        localStorage.removeItem("userStore");

        showToast("Signed out successfully", "success");
        router.push("/");
      } catch (error) {
        console.error("Logout API error:", error);
      }
    };

    return {
      user,
      token,
      signIn,
      signout,
    };
  },
  {
    persist: true,
  }
);

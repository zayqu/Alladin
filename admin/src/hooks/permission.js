import { ref, computed } from "vue";
import axios from "axios";
import { useUserStore } from "@/stores/userStore";
import { API_BASE_URL } from "@/hooks/config";

export function usePermissions() {
  const userStore = useUserStore();
  const userPermissions = ref({
    menu_ids: [],
    action_ids: [],
  });
  const isLoading = ref(false);

  // Fetch current user's permissions
  const fetchMyPermissions = async () => {
    if (!userStore.user?.id) return;

    try {
      isLoading.value = true;
      const url = `${API_BASE_URL}/getUserRights/${userStore.user.id}`;
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${userStore.token}`,
        },
      });

      userPermissions.value = {
        menu_ids: response.data.menu_ids || [],
        action_ids: response.data.action_ids || [],
      };

      return userPermissions.value;
    } catch (error) {
      console.error("Error fetching permissions:", error);
      return userPermissions.value;
    } finally {
      isLoading.value = false;
    }
  };

  // Check if user has access to a specific menu
  const hasMenuAccess = (menuId) => {
    return userPermissions.value.menu_ids.includes(parseInt(menuId));
  };

  // Check if user has access to a specific action by key
  const hasActionAccess = async (actionKey) => {
    // First, fetch all actions to find the action by key
    try {
      const response = await axios.get(`${API_BASE_URL}/getMenusAndActions`, {
        headers: {
          Authorization: `Bearer ${userStore.token}`,
        },
      });

      const allActions = response.data.menus.flatMap((menu) =>
        menu.actions.map((action) => ({
          id: action.id,
          action: action.action, // This is the key like "add_user", "edit_user"
          menu_id: action.menu_id,
        }))
      );

      const action = allActions.find((a) => a.action === actionKey);
      if (!action) {
        console.warn(`Action key "${actionKey}" not found in database`);
        return false;
      }

      // Check if this action is in user's permissions
      return userPermissions.value.action_ids.includes(action.id);
    } catch (error) {
      console.error("Error checking action access:", error);
      return false;
    }
  };

  // Check action access using pre-fetched actions data
  const checkActionAccess = (actionKey, allActionsData) => {
    if (!allActionsData || !Array.isArray(allActionsData)) return false;

    const action = allActionsData.find((a) => a.action === actionKey);
    if (!action) {
      console.warn(
        `Action key "${actionKey}" not found in provided actions data`
      );
      return false;
    }

    return userPermissions.value.action_ids.includes(action.id);
  };

  // Pre-fetch actions and permissions (for pages that need multiple checks)
  const initializePermissions = async () => {
    await fetchMyPermissions();

    // Fetch actions data if needed
    try {
      const response = await axios.get(`${API_BASE_URL}/getMenusAndActions`, {
        headers: {
          Authorization: `Bearer ${userStore.token}`,
        },
      });

      const actionsData = response.data.menus.flatMap((menu) =>
        menu.actions.map((action) => ({
          id: action.id,
          action: action.action,
          menu_id: action.menu_id,
          name: action.name,
        }))
      );

      return {
        permissions: userPermissions.value,
        actions: actionsData,
      };
    } catch (error) {
      console.error("Error initializing permissions:", error);
      return { permissions: userPermissions.value, actions: [] };
    }
  };

  return {
    userPermissions,
    isLoading,
    fetchMyPermissions,
    hasMenuAccess,
    hasActionAccess,
    checkActionAccess,
    initializePermissions,
  };
}

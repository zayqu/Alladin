import { useToast } from "@/hooks/toast";

export const useAxiosError = () => {
  const { showToast } = useToast();

  const handleAxiosError = (error) => {
    let errorMessage = "An error occurred. Please try again.";

    if (error.response) {
      // Server responded with an error (non-2xx status)
      if (error.response.data?.error) {
        // If backend returns message in the response
        errorMessage = error.response.data.error;
      } else {
        // Handle server-side errors (e.g., 500, 404)
        errorMessage = `Server error: ${error.response.status}. Please try again later.`;
      }
    } else if (error.request) {
      // No response received from server
      errorMessage = "Network error. Please check your connection.";
    } else {
      // Other errors (e.g., request setup issues)
      errorMessage = error.message || "An unknown error occurred.";
    }

    // Show the error message using the toast
    showToast(errorMessage, "error");
  };

  return { handleAxiosError };
};

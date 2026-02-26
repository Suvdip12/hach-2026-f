import toast, { Toast, Toaster } from "react-hot-toast";

// Custom toast configuration
export const toastConfig = {
  // Default options for all toasts
  duration: 3000,
  position: "top-right" as const,

  // Styling
  style: {
    background: "#363636",
    color: "#fff",
    borderRadius: "8px",
    padding: "12px 16px",
    fontSize: "14px",
    fontWeight: 500,
  },

  // Success toast options
  success: {
    duration: 3000,
    style: {
      background: "#10b981",
      color: "#fff",
    },
    iconTheme: {
      primary: "#fff",
      secondary: "#10b981",
    },
  },

  // Error toast options
  error: {
    duration: 4000,
    style: {
      background: "#ef4444",
      color: "#fff",
    },
    iconTheme: {
      primary: "#fff",
      secondary: "#ef4444",
    },
  },

  // Loading toast options
  loading: {
    style: {
      background: "#3b82f6",
      color: "#fff",
    },
  },
};

// Custom toast functions with better UX
export const showToast = {
  success: (message: string) => {
    toast.success(message, toastConfig.success);
  },

  error: (message: string) => {
    toast.error(message, toastConfig.error);
  },

  loading: (message: string) => {
    return toast.loading(message, toastConfig.loading);
  },

  promise: <T>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string;
      error: string;
    },
  ) => {
    return toast.promise(
      promise,
      {
        loading: messages.loading,
        success: messages.success,
        error: messages.error,
      },
      {
        success: toastConfig.success,
        error: toastConfig.error,
        loading: toastConfig.loading,
      },
    );
  },

  custom: (message: string, options?: Partial<Toast>) => {
    toast(message, { ...toastConfig, ...options });
  },

  dismiss: (toastId?: string) => {
    toast.dismiss(toastId);
  },
};

export { Toaster };

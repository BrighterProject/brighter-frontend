import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "/api",
  withCredentials: true, // send httpOnly auth cookie on every request
  paramsSerializer: {
    indexes: null, // serialize arrays as key=a&key=b (FastAPI style)
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      // Don't redirect on auth-check calls — they return null when unauthenticated
      const url: string = error.config?.url ?? "";
      const isAuthCheck = url.includes("/users/@me/get");
      if (!isAuthCheck && !window.location.pathname.includes("/auth/login")) {
        const localeMatch =
          window.location.pathname.match(/^\/([a-z]{2})(\/|$)/);
        const locale = localeMatch ? localeMatch[1] : "bg";
        window.location.href = `/${locale}/auth/login`;
      }
    }
    return Promise.reject(error);
  },
);

export default apiClient;

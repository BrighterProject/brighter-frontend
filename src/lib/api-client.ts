import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "/api",
  paramsSerializer: {
    indexes: null, // serialize arrays as key=a&key=b (FastAPI style)
  },
});

// add token to every request
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      localStorage.removeItem("access_token");
      if (!window.location.pathname.includes("/auth/login")) {
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

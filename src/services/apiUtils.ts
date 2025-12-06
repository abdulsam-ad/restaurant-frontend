import axios from 'axios'


const BASE_URL = import.meta.env.VITE_BASE_URL

export const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access')

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})


let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (token) prom.resolve(token);
    else prom.reject(error);
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    // If unauthorized and not a retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // 👇 if refresh is already happening, wait for it
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token: string) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(api(originalRequest));
            },
            reject,
          });
        });
      }

      isRefreshing = true;

      try {
        const refresh = localStorage.getItem("refresh");

        if (!refresh) {
          console.log("❌ No refresh token saved");
          return Promise.reject(error);
        }

        console.log("⏳ Trying refresh token…");

        const res = await axios.post(`${BASE_URL}/user/token-refresh/`, {
          refresh,
        });

        const newAccess = res.data.access;
        const newRefresh = res.data.refresh;

        // Save tokens
        localStorage.setItem("access", newAccess);
        localStorage.setItem("refresh", newRefresh);

        console.log("✔ Token refreshed");

        api.defaults.headers.Authorization = `Bearer ${newAccess}`;
        originalRequest.headers.Authorization = `Bearer ${newAccess}`;

        processQueue(null, newAccess);
        return api(originalRequest);
      } catch (refreshError) {
        console.log("❌ Refresh failed → Logging out");

        processQueue(refreshError, null);

        localStorage.removeItem("access");
        localStorage.removeItem("refresh");

        // OPTIONAL: redirect to login
        window.location.href = "/login";

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export function toFormData(payload: Record<string, any>): FormData {
  const formData = new FormData()
  Object.entries(payload).forEach(([key, value]) => {
    if (value === null || value === undefined) return

    if (Array.isArray(value)) {
      value.forEach(v => formData.append(key, v as any))
    } else {
      formData.append(key, value as any)
    }
  })
  return formData
}

export async function fetchData<T>(basePath: string, url?: string): Promise<T> {
  const finalUrl =
    url && url.startsWith('http')
      ? url
      : url
      ? `${basePath}${url}`
      : basePath
  const res = await api.get(finalUrl)
  return res.data
}

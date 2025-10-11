import axios from 'axios'


export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
  withCredentials: true,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

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

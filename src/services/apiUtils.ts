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

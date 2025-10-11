import {api, fetchData, toFormData} from './apiUtils.ts'


const BASE_URL = '/restaurants/restaurants'

export async function fetchRestaurantById(id: number) {
  return fetchData(`${BASE_URL}/${id}/`)
}

export async function fetchRestaurantLite(search: string= '') {
    const res = await api.get(`${BASE_URL}/lite/`,{
        params: { search }
    })
    return res.data
}

export async function fetchRestaurants(url?: string) {
  return fetchData(BASE_URL + '/', url)
}

export async function fetchOwnedRestaurants() {
  const res = await api.get("/user-profile/user-profile/owned-restaurants/");
  return res.data;
}

export async function createRestaurantApi(payload: {
    name: string
    description?: string
    address?: string
    phone_number?: string
    email?: string
    owners?: number[]
    waiters?: number[]
    image?: File
}) {
  const formData = toFormData(payload)

  const res = await api.post(`${BASE_URL}/`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
  return res.data
}

export async function patchRestaurantApi(
  id: number,
  payload: Partial<{
    name: string
    description: string
    address: string
    phone_number: string
    email: string
    owners: number[] | null
    waiters: number[] | null
    image: File
  }>
) {
  const formData = toFormData(payload)
  const res = await api.patch(`${BASE_URL}/${id}/`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
  return res.data
}

export async function deleteRestaurantApi(id: number) {
  const res = await api.delete(`${BASE_URL}/${id}/`)
  return res.data
}

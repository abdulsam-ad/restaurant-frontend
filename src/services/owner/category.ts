import {api} from "../apiUtils.ts";


const BASE_URL = import.meta.env.VITE_OWNER_CATEGORY_URL
// const BASE_URL = `/restaurants/category`

export async function fetchCategories(restaurant_id: number) {
  const response =
      await api.get(`${BASE_URL}/?restaurant_id=${restaurant_id}`);
  return response.data;
}

export async function createCategory(restaurant_id: number, payload: any) {
    const response = await api.post(`${BASE_URL}/?restaurant_id=${restaurant_id}`, payload);
    return response.data
}

export async function updateCategory(restaurant_id: number, id: number, payload: any) {
    const response = await api.put(`${BASE_URL}/${id}/?restaurant_id=${restaurant_id}`, payload);
    return response.data
}

export async function deleteCategory(restaurant_id: number, id: number) {
    const response =
        await api.delete(`${BASE_URL}/${id}?restaurant_id=${restaurant_id}`);
    return response.data
}

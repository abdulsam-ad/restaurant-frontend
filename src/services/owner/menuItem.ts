import {api} from "../apiUtils.ts";


const BASE_URL = import.meta.env.VITE_OWNER_MENU_ITEM_URL
// const BASE_URL = '/restaurants/menu-items'

export async function createMenuItem(id: number, payload: any) {
  const response = await api.post(`${BASE_URL}/?menu_id=${id}`, payload);
  return response.data;
}

export async function fetchMenuItems(Id: number) {
  const response = await api.get(`${BASE_URL}/?menu_id=${Id}`);
  return response.data;
}

export async function updateMenuItem(id: number, payload: any) {
  const response = await api.patch(`${BASE_URL}/${id}/`, payload);
  return response.data;
}

export async function deleteMenuItem(id: number) {
  await api.delete(`${BASE_URL}/${id}/`);
  return {"Message": "Deleted Successfully"}
}

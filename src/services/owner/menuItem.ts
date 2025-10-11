import {api} from "../apiUtils.ts";


export async function createMenuItem(payload: any) {
  const response = await api.post(`/restaurants/menu-items/`, payload);
  return response.data;
}

// ✅ Fetch menu items for a given menu
export async function fetchMenuItems(menuId: number) {
  const response = await api.get(`/restaurants/menus/${menuId}/items/`);
  return response.data;
}

export async function updateMenuItem(id: number, payload: any) {
  const response = await api.patch(`/restaurants/menu-items/${id}/`, payload);
  return response.data;
}

export async function deleteMenuItem(id: number) {
  await api.delete(`/restaurants/menu-items/${id}/`);
  return {"Message": "Deleted Successfully"}
}

// ✅ Fetch all categories
export async function fetchCategories() {
  const response = await api.get(`/restaurants/categories/`);
  return response.data;
}

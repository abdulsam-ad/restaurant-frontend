import {api, fetchData} from "../apiUtils.ts";


export async function fetchMenus(restaurantId: number, url?: string) {
  // const { data } = await api.get(`/restaurants/menus/?restaurant_id=${restaurantId}`, url);
  return await fetchData(`/restaurants/menus/?${url}&restaurant_id=${restaurantId}`)
}

export async function fetchMenusById(restaurantId: number, menuId: number) {
  // const { data } = await api.get(`/restaurants/menus/?restaurant_id=${restaurantId}`, url);
  return await fetchData(`/restaurants/menus/${menuId}/?restaurant_id=${restaurantId}`)
}

// ✅ Create a new menu (requires restaurant ID)
export async function createMenu(payload: any) {
  const { data } = await api.post(`/restaurants/menus/`, payload);
  return data;
}

import {api, fetchData} from "../apiUtils.ts";
import {selectedRestaurantId} from "../../stores/restaurantState.ts";


const BASE_URL = import.meta.env.VITE_OWNER_MENU_URL

export async function haveMenu(restaurant_id: number, menu_name: string) {
  return await
    api.get(`${BASE_URL}/have-menu/?menu_name=${menu_name}&restaurant_id=${restaurant_id}`)
}

export async function fetchMenus(id: number, url?: string) {
  return await fetchData(`${BASE_URL}/?${url}&restaurant_id=${id}`)
}

export async function fetchMenuById(restaurantId: number, menuId: number) {
  const { data } = await api.get(`${BASE_URL}/${menuId}?restaurant_id=${restaurantId}`)
  return data
}

export async function createMenu(payload: any) {
  const { data } =  await api.post(`${BASE_URL}/`, payload);
  return data
}

export async function createFullMenu(payload: any) {
    return await
    api.post(`${BASE_URL}/full_create/?restaurant_id=${selectedRestaurantId.value}`,
      payload, {
        headers: {
            "Content-Type": "multipart/form-data",
        }
    });
}

export async function updateMenu(restaurantId: number, id:number, payload: any) {
  const { data } =  await api.patch(`${BASE_URL}/${id}/?restaurant_id=${restaurantId}`, payload);
  return data
}

export async function deleteMenu(restaurantId: number, id: number) {
  await api.delete(`${BASE_URL}/${id}/?restaurant_id=${restaurantId}`);
  return {"Message": "Deleted Successfully"};
}

import { api } from "./apiUtils.ts";


const BASE_URL = '/user-profile/user-profile/notifications'

export async function fetchMyNotifications() {
  const res = await api.get(`${BASE_URL}/`);
  return res.data;
}

export async function markNotificationRead(id: number) {
  const res = await api.patch(`${BASE_URL}/${id}/mark-as-read/`, { read: true });
  return res.data;
}

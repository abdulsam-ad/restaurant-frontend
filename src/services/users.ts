import {api, fetchData, toFormData} from './apiUtils.ts'


const BASE_URL = '/user-profile/user-profile'

export async function getMyProfile(){
    return (await api.get('/user/me/')).data
}

export async function fetchUserByUserName (username: string) {
  return fetchData(`${BASE_URL}/${username}/`)
}

export async function fetchOwnersLite(search: string= '') {
    const res = await api.get(`${BASE_URL}/owners-lite/`, {
        params: { search }
    })
    return res.data
}

export async function fetchWaitersLite(search: string= '') {
    const res = await api.get(`${BASE_URL}/waiters-lite/`, {
        params: { search }
    })
    return res.data
}

export async function fetchUsers(url?: string) {
  return fetchData(BASE_URL + '/', url)
}

export async function createUserApi(payload: {
    first_name?: string
    last_name?: string
    phone?: string
    bio?: string
    email: string
    username: string
    password: string
    user_type: string
    restaurant?: number | null
    owned_restaurants?: number[]
    image?: File
}) {
    const formData = toFormData(payload)
    const res = await api.post(`${BASE_URL}/`, formData,{
        headers: { 'Content-Type': 'multipart/form-data' }
    })
    return res.data
}

export async function patchUserApi(
    username: string,
    payload: Partial<{
        first_name: string
        last_name: string
        phone: string
        bio: string
        email: string
        username: string
        password: string
        user_type: string
        restaurant: number
        owned_restaurants: number[] | null
        image: File | null
    }>
) {
    const formData = toFormData(payload)
    const res = await api.patch(`${BASE_URL}/${username}/`, formData,{
        headers: { 'Content-Type': 'multipart/form-data' }
    })
    return res.data
}

export async function deleteUserApi(username: string) {
  const res = await api.delete(`${BASE_URL}/${username}/`)
  return res.data
}

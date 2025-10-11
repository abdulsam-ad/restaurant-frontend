import { api } from './apiUtils.ts'


export async function login(email: string, password: string) {
  const res = await api.post('/user/login/', { email, password })
  saveTokens(res.data.access, res.data.refresh, res.data.user_type)
  return res.data
}

export async function signup(username: string, email: string, password: string) {
  console.log('Sending signup payload:', { username, email, password })  // 👈 log payload
  const res = await api.post('/user/register/', { username, email, password })
  console.log('Signup response:', res.data)  // 👈 log response
  return res.data
}

export async function accountActivation(token: string) {
  const res = await api.post(`/user/account-activation/${token}`)
  saveTokens(res.data.access, res.data.refresh, res.data.user_type)
  return res.data.user_type
}

function saveTokens(access: string, refresh: string, user_type: string) {
  localStorage.setItem('access', access)
  localStorage.setItem('refresh', refresh)
  localStorage.setItem('user_type', user_type)
}

export async function logoutUser() {
  const refresh = localStorage.getItem('refresh')
  await api.post("user/token-refresh/", { refresh }, {
        headers: { 'Content-Type': 'application/json' }
    })
  localStorage.removeItem('access')
  localStorage.removeItem('refresh')
  localStorage.removeItem('user_type')
  localStorage.removeItem("current-user");
}

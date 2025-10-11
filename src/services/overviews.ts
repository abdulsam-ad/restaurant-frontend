import { api } from './apiUtils.ts'


export async function fetchOverviewMetrics() {
  const res = await api.get('/superadmin/overview/')
  return res.data
}

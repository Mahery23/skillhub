import { apiRequest } from './apiClient'

export const getFormations = async () => {
  const payload = await apiRequest('/api/formations')
  return Array.isArray(payload?.data) ? payload.data : []
}

export const getFormation = async (id) => {
  const payload = await apiRequest(`/api/formations/${id}`)
  return payload?.formation || null
}

export const getFormationModules = async (id) => {
  const payload = await apiRequest(`/api/formations/${id}/modules`)
  return Array.isArray(payload?.modules) ? payload.modules : []
}



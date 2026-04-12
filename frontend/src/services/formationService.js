import { apiRequest } from './apiClient'
import { getStoredToken } from './authService'

const authHeaders = () => {
  const token = getStoredToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export const getFormations = async () => {
  const payload = await apiRequest('/api/formations')
  return Array.isArray(payload?.data) ? payload.data : Array.isArray(payload) ? payload : []
}

export const getFormation = async (id) => {
  const payload = await apiRequest(`/api/formations/${id}`)
  return payload?.formation || payload
}

export const getFormationModules = async (id) => {
  const payload = await apiRequest(`/api/formations/${id}/modules`)
  return Array.isArray(payload?.data) ? payload.data : Array.isArray(payload) ? payload : []
}

export const getMyFormations = async () => {
  const payload = await apiRequest('/api/formations', { headers: authHeaders() })
  return Array.isArray(payload?.data) ? payload.data : []
}

export const createFormation = async (data) => {
  return apiRequest('/api/formations', {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(data),
  })
}

export const updateFormation = async (id, data) => {
  return apiRequest(`/api/formations/${id}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(data),
  })
}

export const deleteFormation = async (id) => {
  return apiRequest(`/api/formations/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  })
}
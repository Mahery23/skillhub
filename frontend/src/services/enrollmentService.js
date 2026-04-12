import { apiRequest } from './apiClient'
import { getStoredToken } from './authService'

const authHeaders = () => {
    const token = getStoredToken()
    return token ? { Authorization: `Bearer ${token}` } : {}
}

export const getFormationsApprenant = async () => {
    return apiRequest('/api/apprenant/formations', {
        headers: authHeaders(),
    })
}

export const inscrire = async (formationId) => {
    return apiRequest(`/api/formations/${formationId}/inscription`, {
        method: 'POST',
        headers: authHeaders(),
    })
}

export const desinscrire = async (formationId) => {
    return apiRequest(`/api/formations/${formationId}/inscription`, {
        method: 'DELETE',
        headers: authHeaders(),
    })
}
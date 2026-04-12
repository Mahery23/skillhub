import { apiRequest } from './apiClient'
import { getStoredToken } from './authService'

const authHeaders = () => {
    const token = getStoredToken()
    return token ? { Authorization: `Bearer ${token}` } : {}
}

export const getFormations = async ({ recherche = '', categorie = '', niveau = '' } = {}) => {
    const params = new URLSearchParams()
    if (recherche) params.append('search', recherche)
    if (categorie && categorie !== 'Toutes') params.append('categorie', categorie)
    if (niveau && niveau !== 'Tous') params.append('niveau', niveau)

    const query = params.toString() ? `?${params.toString()}` : ''
    return apiRequest(`/api/formations${query}`)
}

export const getFormation = async (id) => {
    return apiRequest(`/api/formations/${id}`)
}

export const getFormationsFormateur = async () => {
    return apiRequest('/api/formations', {
        headers: authHeaders(),
    })
}

export const creerFormation = async (data) => {
    return apiRequest('/api/formations', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify(data),
    })
}

export const modifierFormation = async (id, data) => {
    return apiRequest(`/api/formations/${id}`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify(data),
    })
}

export const supprimerFormation = async (id) => {
    return apiRequest(`/api/formations/${id}`, {
        method: 'DELETE',
        headers: authHeaders(),
    })
}

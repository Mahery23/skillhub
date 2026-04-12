import { API_BASE_URL, apiRequest } from './apiClient'

const TOKEN_KEY = 'skillhub_token'
const USER_KEY = 'skillhub_user'

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const normalizeUser = (rawUser = {}, fallback = {}) => ({
  id: rawUser.id || fallback.id || null,
  name: rawUser.name || rawUser.nom || fallback.name || 'Utilisateur',
  email: rawUser.email || fallback.email || '',
  role: rawUser.role || rawUser.role_name || fallback.role || 'apprenant',
})

const saveSession = ({ token, user }) => {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token)
  }

  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

const clearSession = () => {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}

const loginWithApi = async ({ email, password }) => {
  const payload = await apiRequest('/api/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })

  const token = payload?.token || payload?.access_token
  const user = normalizeUser(payload?.user, { email })

  if (!token) {
    throw new Error('Token JWT manquant dans la reponse login.')
  }

  const session = { token, user, mode: 'api' }
  saveSession(session)

  return session
}

const registerWithApi = async ({ name, email, password, role }) => {
  const payload = await apiRequest('/api/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password, role }),
  })

  const token = payload?.token || payload?.access_token
  const user = normalizeUser(payload?.user, { name, email, role })

  if (!token) {
    throw new Error('Token JWT manquant dans la reponse register.')
  }

  const session = { token, user, mode: 'api' }
  saveSession(session)

  return session
}

const loginWithMock = async ({ email, role }) => {
  await wait(400)

  const user = normalizeUser({
    name: email ? email.split('@')[0] : 'Utilisateur',
    email,
    role,
  })

  const session = { token: 'mock-token', user, mode: 'mock' }
  saveSession(session)

  return session
}

const registerWithMock = async ({ name, email, role }) => {
  await wait(400)

  const user = normalizeUser({ name, email, role })
  const session = { token: 'mock-token', user, mode: 'mock' }
  saveSession(session)

  return session
}

export const getStoredUser = () => {
  const rawUser = localStorage.getItem(USER_KEY)

  if (!rawUser) {
    return null
  }

  try {
    return normalizeUser(JSON.parse(rawUser))
  } catch {
    clearSession()
    return null
  }
}

export const getStoredToken = () => localStorage.getItem(TOKEN_KEY)

export const getProfile = async () => {
  const token = getStoredToken()

  if (!token) {
    return null
  }

  if (!API_BASE_URL || token === 'mock-token') {
    return getStoredUser()
  }

  const payload = await apiRequest('/api/profile', {
    headers: { Authorization: `Bearer ${token}` },
  })

  const user = normalizeUser(payload?.user || payload)
  saveSession({ token, user })

  return user
}

export const login = async (credentials) => {
  try {
    return await loginWithApi(credentials)
  } catch (error) {
    if (API_BASE_URL) {
      throw error
    }

    return loginWithMock(credentials)
  }
}

export const register = async (payload) => {
  try {
    return await registerWithApi(payload)
  } catch (error) {
    if (API_BASE_URL) {
      throw error
    }

    return registerWithMock(payload)
  }
}

export const logout = () => {
  clearSession()
}





const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '')

const buildUrl = (path) => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`

  return `${API_BASE_URL}${normalizedPath}`
}

export const parseJson = async (response) => {
  const text = await response.text()

  if (!text) {
    return {}
  }

  try {
    return JSON.parse(text)
  } catch {
    return {}
  }
}

export const apiRequest = async (path, options = {}) => {
  if (!API_BASE_URL) {
    throw new Error('VITE_API_BASE_URL manquant.')
  }

  const { headers: customHeaders = {}, ...restOptions } = options

  let response

  try {
    response = await fetch(buildUrl(path), {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...customHeaders,
      },
      ...restOptions,
    })
  } catch {
    const networkError = new Error('Failed to fetch')
    networkError.status = 0
    throw networkError
  }

  const payload = await parseJson(response)

  if (response.redirected) {
    const redirectError = new Error('Redirection inattendue détectée. Veuillez vous reconnecter.')
    redirectError.status = response.status || 0
    throw redirectError
  }

  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem('skillhub_token')
      localStorage.removeItem('skillhub_user')
    }

    const error = new Error(payload?.message || 'Une erreur est survenue.')

    if (payload?.errors && typeof payload.errors === 'object') {
      error.details = payload.errors
    }

    error.status = response.status
    throw error
  }

  return payload
}

export { API_BASE_URL }


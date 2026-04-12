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

  const { headers: optionHeaders, ...restOptions } = options

  const response = await fetch(buildUrl(path), {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...optionHeaders,
    },
    ...restOptions,
  })

  const payload = await parseJson(response)

  if (!response.ok) {
    throw new Error(payload?.message || 'Une erreur est survenue.')
  }

  return payload
}

export { API_BASE_URL }
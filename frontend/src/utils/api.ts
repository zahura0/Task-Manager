/**
 * Get the base API URL, ensuring no trailing slash
 */
export function getApiUrl(): string {
  const API_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:5000'
  return API_URL.replace(/\/$/, '')
}

/**
 * Build a complete API endpoint URL
 */
export function getApiEndpoint(endpoint: string): string {
  const baseUrl = getApiUrl()
  const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`
  return `${baseUrl}${path}`
}

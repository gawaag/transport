const TOKEN_KEY = 'lx-token'

export function getToken() {
  return sessionStorage.getItem(TOKEN_KEY) || ''
}

export function setToken(token: string) {
  sessionStorage.setItem(TOKEN_KEY, token)
}

export function clearToken() {
  sessionStorage.removeItem(TOKEN_KEY)
}

async function request<T>(url: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers)
  headers.set('Content-Type', 'application/json')
  const token = getToken()
  if (token) headers.set('Authorization', `Bearer ${token}`)
  const res = await fetch(url, { ...init, headers })
  const data = (await res.json().catch(() => ({}))) as T & { error?: string }
  if (!res.ok) {
    throw new Error(data.error || 'Erreur réseau.')
  }
  return data
}

export const api = {
  login: (username: string, code: string) =>
    request<{ ok: boolean; token: string }>('/api/login', {
      method: 'POST',
      body: JSON.stringify({ username, code }),
    }),
  session: () => request<{ ok: boolean }>('/api/session'),
  saveContent: (content: unknown) =>
    request<{ ok: boolean }>('/api/content', {
      method: 'POST',
      body: JSON.stringify({ content }),
    }),
  saveCredentials: (username: string, code: string) =>
    request<{ ok: boolean }>('/api/credentials', {
      method: 'POST',
      body: JSON.stringify({ username, code }),
    }),
  leads: () => request<{ ok: boolean; leads: unknown[] }>('/api/leads'),
  postLead: (lead: unknown) =>
    request<{ ok: boolean; id: string }>('/api/leads', {
      method: 'POST',
      body: JSON.stringify(lead),
    }),
}

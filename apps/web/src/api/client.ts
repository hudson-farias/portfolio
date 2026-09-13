type SearchParams = Record<string, string | string[] | undefined>

const apiBaseURL = (process.env.NEXT_PUBLIC_API_URL || '').replace(/\/$/, '')
const authBaseURL = (process.env.NEXT_PUBLIC_AUTH_URL || '').replace(/\/$/, '')

class ApiClient {
  get loginUrl() {
    return `${authBaseURL}/discord/redirect`
  }

  private headers(method: string, isForm: boolean = false): Record<string, string> {
    const headers: Record<string, string> = {}
    if (!isForm && method !== 'GET' && method !== 'HEAD') {
      headers['Content-Type'] = 'application/json'
    }
    return headers
  }

  private withQuery(endpoint: string, query?: string | SearchParams) {
    if (!query) return endpoint

    if (typeof query === 'string') {
      return query ? `${endpoint}?${query}` : endpoint
    }

    const search = new URLSearchParams()

    for (const [key, value] of Object.entries(query)) {
      if (typeof value === 'string' && value) search.set(key, value)
    }

    const qs = search.toString()
    return qs ? `${endpoint}?${qs}` : endpoint
  }

  private async request(method: string, endpoint: string, body?: unknown): Promise<Response> {
    const isForm = body instanceof FormData
    const headers = this.headers(method, isForm)
    const payload = isForm ? body : body !== undefined ? JSON.stringify(body) : undefined

    const response = await fetch(`${apiBaseURL}${endpoint}`, {
      method,
      headers,
      body: payload,
      credentials: 'include',
    })

    return response
  }

  async checkAuth(): Promise<boolean> {
    const response = await fetch(`${authBaseURL}/verify`, {
      credentials: 'include',
      cache: 'no-store',
    })

    return response.status === 204
  }

  logout(redirect: string = '/admin'): void {
    const target = new URL(redirect, window.location.origin).toString()
    window.location.href = `${authBaseURL}/logout?redirect=${encodeURIComponent(target)}`
  }

  get(endpoint: string, query?: string | SearchParams): Promise<Response> {
    return this.request('GET', this.withQuery(endpoint, query))
  }

  post(endpoint: string, body: unknown): Promise<Response> {
    return this.request('POST', endpoint, body)
  }

  put(endpoint: string, body: unknown): Promise<Response> {
    return this.request('PUT', endpoint, body)
  }

  patch(endpoint: string, body: unknown): Promise<Response> {
    return this.request('PATCH', endpoint, body)
  }

  delete(endpoint: string): Promise<Response> {
    return this.request('DELETE', endpoint)
  }
}

export const API = new ApiClient()

import { cookies } from 'next/headers'

type SearchParams = Record<string, string | string[] | undefined>

const AUTH_COOKIE = 'ACCESS_TOKEN_ADMIN'

const apiBaseURL = (process.env.NEXT_PUBLIC_API_URL || '').replace(/\/$/, '')
const authBaseURL = (process.env.NEXT_PUBLIC_AUTH_URL || '').replace(/\/$/, '')

class ApiServer {
  private async authHeaders(): Promise<Record<string, string>> {
    const cookieStore = await cookies()
    const token = cookieStore.get(AUTH_COOKIE)?.value

    return {
      ...(token ? { Cookie: `${AUTH_COOKIE}=${token}` } : {}),
    }
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

  async request(method: string, endpoint: string, body?: unknown): Promise<Response> {
    const headers = await this.authHeaders()

    if (body !== undefined) {
      headers['Content-Type'] = 'application/json'
    }

    return fetch(`${apiBaseURL}${endpoint}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      cache: 'no-store',
      credentials: 'include',
    })
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

  delete(endpoint: string): Promise<Response> {
    return this.request('DELETE', endpoint)
  }

  async checkAuth(): Promise<boolean> {
    const headers = await this.authHeaders()
    const response = await fetch(`${authBaseURL}/auth/verify`, {
      headers,
      cache: 'no-store',
      credentials: 'include',
    })

    return response.status === 204
  }
}

export const API = new ApiServer()

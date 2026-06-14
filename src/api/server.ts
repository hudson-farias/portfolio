import { cookies } from 'next/headers'

import { AUTH_COOKIE } from './client'

type SearchParams = Record<string, string | string[] | undefined>

class ApiServer {
  private baseURL: string

  constructor() {
    this.baseURL = (process.env.NEXT_PUBLIC_API_URL || '').replace(/\/$/, '')
  }

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

    return fetch(`${this.baseURL}${endpoint}`, {
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

  async checkAuth(): Promise<boolean> {
    const response = await this.get('/auth/verify')
    return response.status === 204
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
}

export const API = new ApiServer()

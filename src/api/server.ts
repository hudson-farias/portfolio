import { cookies } from 'next/headers'

import { AUTH_COOKIE } from './client'

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

  get(endpoint: string): Promise<Response> {
    return this.request('GET', endpoint)
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

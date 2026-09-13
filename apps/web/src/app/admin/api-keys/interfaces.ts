export interface AdminApiKey {
  id: number
  name: string
  key_prefix: string
  created_at: string | null
  last_used_at: string | null
  revoked: boolean
}

export interface AdminApiKeyCreated extends AdminApiKey {
  key: string
}

export interface ApiKeysPageClientProps {
  initialItems: AdminApiKey[]
}

import { redirect } from "next/navigation"

import { API } from "@/api/server"
import { ApiKeysPageClient } from "./page-client"
import type { AdminApiKey } from "./interfaces"

export const dynamic = "force-dynamic"

export default async function ApiKeysPage() {
  const canMutate = await API.checkAuth()
  if (!canMutate) redirect("/admin")

  const response = await API.get("/admin/api_keys")
  if (!response.ok) {
    throw new Error("Não foi possível carregar as chaves de acesso.")
  }

  const raw: AdminApiKey[] = await response.json()
  const items = raw.map(({ id, name, key_prefix, created_at, last_used_at, revoked }) => ({
    id,
    name,
    key_prefix,
    created_at,
    last_used_at,
    revoked,
  }))

  return <ApiKeysPageClient initialItems={items} />
}

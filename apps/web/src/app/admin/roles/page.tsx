import { API } from "@/api/server"
import { RolesPageClient } from "./page-client"
import type { AdminRole } from "./interfaces"

export const dynamic = "force-dynamic"

export default async function RolesPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const response = await API.get("/admin/roles", await searchParams)
  const items: AdminRole[] = await response.json()

  return <RolesPageClient initialItems={items} />
}

import { API } from "@/api/server"
import { DatabasesPageClient } from "./page-client"
import type { AdminDatabase } from "./interfaces"

export const dynamic = "force-dynamic"

export default async function DatabasesPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const response = await API.get("/admin/databases", await searchParams)
  const items: AdminDatabase[] = await response.json()

  return <DatabasesPageClient initialItems={items} />
}

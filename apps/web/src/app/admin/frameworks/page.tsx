import { API } from "@/api/server"
import { FrameworksPageClient } from "./page-client"
import type { AdminFramework } from "./interfaces"

export const dynamic = "force-dynamic"

export default async function FrameworksPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams
  const response = await API.get("/admin/frameworks", params)
  const items: AdminFramework[] = await response.json()

  return <FrameworksPageClient initialItems={items} />
}

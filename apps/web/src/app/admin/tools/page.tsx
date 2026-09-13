import { API } from "@/api/server"
import { ToolsPageClient } from "./page-client"
import type { AdminTool } from "./interfaces"

export const dynamic = "force-dynamic"

export default async function ToolsPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const response = await API.get("/admin/tools", await searchParams)
  const items: AdminTool[] = await response.json()

  return <ToolsPageClient initialItems={items} />
}

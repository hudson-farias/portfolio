import { notFound } from "next/navigation"

import { API } from "@/api/server"
import type { AdminTool } from "../interfaces"
import { ToolsEditPageClient } from "./page-client"

export default async function ToolsEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const toolId = Number(id)
  if (!Number.isFinite(toolId)) notFound()

  const response = await API.get(`/admin/tools/${toolId}`)
  if (!response.ok) notFound()

  const tool: AdminTool = await response.json()
  return <ToolsEditPageClient tool={tool} />
}

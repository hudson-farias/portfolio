import { notFound } from "next/navigation"

import { API } from "@/api/server"
import type { AdminDatabase } from "../interfaces"
import { DatabasesEditPageClient } from "./page-client"

export default async function DatabasesEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const databaseId = Number(id)
  if (!Number.isFinite(databaseId)) notFound()

  const response = await API.get(`/admin/databases/${databaseId}`)
  if (!response.ok) notFound()

  const database: AdminDatabase = await response.json()
  return <DatabasesEditPageClient database={database} />
}

import { notFound } from "next/navigation"

import { API } from "@/api/server"
import type { AdminRole } from "../interfaces"
import { RolesEditPageClient } from "./page-client"

export default async function RolesEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const roleId = Number(id)
  if (!Number.isFinite(roleId)) notFound()

  const response = await API.get(`/admin/roles/${roleId}`)
  if (!response.ok) notFound()

  const role: AdminRole = await response.json()
  return <RolesEditPageClient role={role} />
}

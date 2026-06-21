import { API } from "@/api/server"
import type { AdminRole } from "../../roles/interfaces"
import type { ExperienceRole } from "../interfaces"
import { ExperiencesNewPageClient } from "./page-client"

export const dynamic = "force-dynamic"

function rolesForForm(roles: AdminRole[]): ExperienceRole[] {
  return roles.map((role) => ({ id: role.id, title: role.title, active: role.active }))
}

export default async function ExperiencesNewPage() {
  const response = await API.get("/admin/roles")
  const roles = response.ok ? rolesForForm(await response.json()) : []

  return <ExperiencesNewPageClient roles={roles} />
}

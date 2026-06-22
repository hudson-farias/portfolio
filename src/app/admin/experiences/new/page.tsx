import { API } from "@/api/server"
import type { AdminRole } from "../../roles/interfaces"
import type { AdminFramework } from "../../frameworks/interfaces"
import type { ExperienceRole } from "../interfaces"
import { ExperiencesNewPageClient } from "./page-client"

export const dynamic = "force-dynamic"

function rolesForForm(roles: AdminRole[]): ExperienceRole[] {
  return roles.map((role) => ({ id: role.id, title: role.title, active: role.active }))
}

export default async function ExperiencesNewPage() {
  const [rolesRes, frameworksRes] = await Promise.all([
    API.get("/admin/roles"),
    API.get("/admin/frameworks"),
  ])
  const roles = rolesRes.ok ? rolesForForm(await rolesRes.json()) : []
  const frameworks: AdminFramework[] = frameworksRes.ok ? await frameworksRes.json() : []

  return <ExperiencesNewPageClient roles={roles} frameworks={frameworks} />
}

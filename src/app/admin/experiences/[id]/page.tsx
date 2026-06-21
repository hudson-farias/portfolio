import { notFound } from "next/navigation"

import { API } from "@/api/server"
import type { AdminRole } from "../../roles/interfaces"
import type { AdminExperience, ExperienceRole } from "../interfaces"
import { ExperiencesEditPageClient } from "./page-client"

function rolesForForm(roles: AdminRole[]): ExperienceRole[] {
  return roles.map((role) => ({ id: role.id, title: role.title, active: role.active }))
}

export default async function ExperiencesEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const experienceId = Number(id)
  if (!Number.isFinite(experienceId)) notFound()

  const [experienceRes, rolesRes] = await Promise.all([
    API.get(`/admin/experiences/${experienceId}`),
    API.get("/admin/roles"),
  ])

  if (!experienceRes.ok) notFound()

  const experience: AdminExperience = await experienceRes.json()
  const roles = rolesRes.ok ? rolesForForm(await rolesRes.json()) : []

  return <ExperiencesEditPageClient experience={experience} roles={roles} />
}

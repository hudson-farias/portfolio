import { notFound } from "next/navigation"

import { API } from "@/api/server"
import type { AdminSkill } from "../interfaces"
import { SkillsEditPageClient } from "./page-client"

export default async function SkillsEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const skillId = Number(id)
  if (!Number.isFinite(skillId)) notFound()

  const response = await API.get(`/admin/skills/${skillId}`)
  if (!response.ok) notFound()

  const skill: AdminSkill = await response.json()
  return <SkillsEditPageClient skill={skill} />
}

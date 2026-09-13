import { API } from "@/api/server"
import { SkillsPageClient } from "./page-client"
import type { AdminSkills } from "./interfaces"

export const dynamic = "force-dynamic"

export default async function SkillsPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const response = await API.get("/admin/skills", await searchParams)
  const data: AdminSkills = await response.json()

  return <SkillsPageClient initialData={data} />
}

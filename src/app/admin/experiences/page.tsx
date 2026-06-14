import { API } from "@/api/server"
import { ExperiencesPageClient } from "./page-client"
import type { AdminExperiences } from "./interfaces"

export const dynamic = "force-dynamic"

const emptyData: AdminExperiences = { experiences: [], roles: [] }

function normalizeExperiencesPayload(raw: unknown): AdminExperiences {
  if (Array.isArray(raw)) return { experiences: raw, roles: [] }

  if (raw && typeof raw === "object" && "experiences" in raw) {
    const payload = raw as AdminExperiences
    return {
      experiences: payload.experiences ?? [],
      roles: payload.roles ?? [],
    }
  }

  return emptyData
}

export default async function ExperiencesPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const response = await API.get("/admin/experiences", await searchParams)
  if (!response.ok) return <ExperiencesPageClient initialData={emptyData} />

  const initialData = normalizeExperiencesPayload(await response.json())

  return <ExperiencesPageClient initialData={initialData} />
}

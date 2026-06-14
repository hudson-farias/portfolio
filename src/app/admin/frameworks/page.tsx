import { API } from "@/api/server"
import { FrameworksPageClient } from "./page-client"
import type { AdminFramework } from "./interfaces"
import type { AdminLanguage } from "../languages/interfaces"

export const dynamic = "force-dynamic"

export default async function FrameworksPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams
  const [frameworksRes, languagesRes] = await Promise.all([
    API.get("/admin/frameworks", params),
    API.get("/admin/languages"),
  ])

  const items: AdminFramework[] = await frameworksRes.json()
  const languages: AdminLanguage[] = await languagesRes.json()

  return <FrameworksPageClient initialItems={items} languages={languages} />
}

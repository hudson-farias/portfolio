import { API } from "@/api/server"
import { LanguagesPageClient } from "./page-client"
import type { AdminLanguage } from "./interfaces"

export const dynamic = "force-dynamic"

export default async function LanguagesPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const response = await API.get("/admin/languages", await searchParams)
  const items: AdminLanguage[] = await response.json()

  return <LanguagesPageClient initialItems={items} />
}

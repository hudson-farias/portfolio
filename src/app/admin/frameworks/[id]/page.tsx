import { notFound } from "next/navigation"

import { API } from "@/api/server"
import type { AdminFramework } from "../interfaces"
import type { AdminLanguage } from "../../languages/interfaces"
import { FrameworksEditPageClient } from "./page-client"

export default async function FrameworksEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const frameworkId = Number(id)
  if (!Number.isFinite(frameworkId)) notFound()

  const [frameworkRes, languagesRes] = await Promise.all([
    API.get(`/admin/frameworks/${frameworkId}`),
    API.get("/admin/languages"),
  ])

  if (!frameworkRes.ok) notFound()

  const framework: AdminFramework = await frameworkRes.json()
  const languages: AdminLanguage[] = languagesRes.ok ? await languagesRes.json() : []

  return <FrameworksEditPageClient framework={framework} languages={languages} />
}

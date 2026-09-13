import { notFound } from "next/navigation"

import { API } from "@/api/server"
import type { AdminLanguage } from "../interfaces"
import { LanguagesEditPageClient } from "./page-client"

export default async function LanguagesEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const languageId = Number(id)
  if (!Number.isFinite(languageId)) notFound()

  const response = await API.get(`/admin/languages/${languageId}`)
  if (!response.ok) notFound()

  const language: AdminLanguage = await response.json()
  return <LanguagesEditPageClient language={language} />
}

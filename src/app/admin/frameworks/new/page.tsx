import { API } from "@/api/server"
import type { AdminLanguage } from "../../languages/interfaces"
import { FrameworksNewPageClient } from "./page-client"

export default async function FrameworksNewPage() {
  const response = await API.get("/admin/languages")
  const languages: AdminLanguage[] = await response.json()

  return <FrameworksNewPageClient languages={languages} />
}

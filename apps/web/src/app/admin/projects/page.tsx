import { API } from "@/api/server"

import { ProjectsPageClient } from "./page-client"
import type { AdminProjects } from "./interfaces"

export const dynamic = "force-dynamic"

export default async function ProjectsPage() {
  const response = await API.get("/admin/projects")
  const data: AdminProjects = await response.json()

  return <ProjectsPageClient initialData={data} />
}

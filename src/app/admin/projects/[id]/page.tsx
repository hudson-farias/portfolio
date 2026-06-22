import { notFound } from "next/navigation"

import { API } from "@/api/server"
import type { AdminProject } from "../interfaces"
import type { AdminFramework } from "../../frameworks/interfaces"
import type { ProjectTranslationFields } from "../interfaces"
import { ProjectsEditPageClient } from "./page-client"
import { resolveTranslations } from "@/lib/admin/locale"

const TRANSLATION_KEYS: (keyof ProjectTranslationFields)[] = ["title", "description"]

function emptyProjectTranslationFields(): ProjectTranslationFields {
  return { title: "", description: "" }
}

function projectFormFromVisible(project: AdminProject) {
  return {
    image_url: project.image_url ?? "",
    live_url: project.live_url ?? project.homepage ?? "",
    repo_url: project.repo_url ?? project.html_url,
    framework_ids: project.framework_ids ?? project.frameworks?.map((framework) => framework.id) ?? [],
    translations: resolveTranslations(
      TRANSLATION_KEYS,
      { title: project.title ?? project.name, description: project.description ?? "" },
      project.translations,
      emptyProjectTranslationFields,
    ),
  }
}

export default async function ProjectsEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const gitId = Number(id)
  if (!Number.isFinite(gitId)) notFound()

  const [response, frameworksRes] = await Promise.all([
    API.get(`/admin/projects/${gitId}`),
    API.get("/admin/frameworks"),
  ])
  if (!response.ok) notFound()

  const project: AdminProject = await response.json()
  const frameworks: AdminFramework[] = frameworksRes.ok ? await frameworksRes.json() : []

  return (
    <ProjectsEditPageClient gitId={gitId} initialForm={projectFormFromVisible(project)} frameworks={frameworks} />
  )
}

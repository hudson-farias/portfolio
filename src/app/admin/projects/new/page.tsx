import { redirect } from "next/navigation"

import { API } from "@/api/server"
import type { AdminProject } from "../interfaces"
import type { AdminFramework } from "../../frameworks/interfaces"
import { ProjectsNewPageClient } from "./page-client"
import { emptyProjectForm } from "../projects-form-client"
import { resolveTranslations } from "@/lib/admin/locale"
import type { ProjectTranslationFields } from "../interfaces"

export const dynamic = "force-dynamic"

const TRANSLATION_KEYS: (keyof ProjectTranslationFields)[] = ["title", "description"]

function emptyProjectTranslationFields(): ProjectTranslationFields {
  return { title: "", description: "" }
}

function projectFormFromGitHub(project: AdminProject) {
  return {
    image_url: "",
    live_url: project.homepage ?? "",
    repo_url: project.html_url,
    framework_ids: [],
    translations: resolveTranslations(
      TRANSLATION_KEYS,
      { title: project.name, description: project.description ?? "" },
      project.translations,
      emptyProjectTranslationFields,
    ),
  }
}

async function loadFrameworks() {
  const response = await API.get("/admin/frameworks")
  return response.ok ? ((await response.json()) as AdminFramework[]) : []
}

export default async function ProjectsNewPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams
  const external = params.external === "1"
  const gitIdParam = params.git_id
  const gitId = typeof gitIdParam === "string" ? Number(gitIdParam) : NaN
  const frameworks = await loadFrameworks()

  if (external) {
    return <ProjectsNewPageClient mode="create-external" initialForm={emptyProjectForm} frameworks={frameworks} />
  }

  if (!Number.isFinite(gitId)) {
    redirect("/admin/projects")
  }

  const response = await API.get(`/admin/projects/${gitId}`)
  if (!response.ok) {
    redirect("/admin/projects")
  }

  const project: AdminProject = await response.json()

  return (
    <ProjectsNewPageClient
      mode="create-github"
      gitId={gitId}
      initialForm={projectFormFromGitHub(project)}
      frameworks={frameworks}
    />
  )
}

import type { Metadata } from "next"

import { API } from "@/api/server"
import { Projects } from "@/themes/default/page/projects"
import { PageIntro } from "@/themes/default/page-intro"
import { getDictionary } from "@/i18n/get-dictionary"
import { localizedPageSeo } from "@/i18n/seo"
import { resolveSegmentLocale } from "@/i18n/segment-locale"

import type { ProjectsResponse } from "./interfaces"

export default async function ProjectsRoutePage({ params }: { params: Promise<{ segment: string }> }) {
  const locale = await resolveSegmentLocale(params)
  const t = await getDictionary(locale)
  const response = await API.get("/landpage/projects", { locale })
  if (!response.ok) throw new Error(t.errors.projectsLoad)

  const { projects }: ProjectsResponse = await response.json()

  return (
    <div className="space-y-10">
      <PageIntro title={t.projects.title} description={t.projects.description} />
      <Projects
        projects={projects}
        copy={t.projects}
        common={{
          noDescription: t.common.noDescription,
          repository: t.common.repository,
          demo: t.common.demo,
        }}
        layout="grid"
        embedded
      />
    </div>
  )
}

export async function generateMetadata({ params }: { params: Promise<{ segment: string }> }): Promise<Metadata> {
  const locale = await resolveSegmentLocale(params)
  const t = await getDictionary(locale)
  return {
    title: t.projects.meta.title,
    description: t.projects.meta.description,
    ...(await localizedPageSeo(locale, "/projects")),
  }
}

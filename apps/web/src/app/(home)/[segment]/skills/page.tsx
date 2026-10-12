import type { Metadata } from "next"

import { API } from "@/api/server"
import { StackSkillsView } from "@/themes/default/page/stack-skills-view"
import { PageIntro } from "@/themes/default/page-intro"
import { getDictionary } from "@/i18n/get-dictionary"
import { localizedPageSeo } from "@/i18n/seo"
import { resolveSegmentLocale } from "@/i18n/segment-locale"

import type { SkillsResponse } from "./interfaces"

export default async function SkillsRoutePage({ params }: { params: Promise<{ segment: string }> }) {
  const locale = await resolveSegmentLocale(params)
  const t = await getDictionary(locale)
  const response = await API.get("/landpage/skills", { locale })
  if (!response.ok) throw new Error(t.errors.skillsLoad)

  const { skills }: SkillsResponse = await response.json()

  return (
    <div className="space-y-10">
      <PageIntro title={t.skillsPage.title} description={t.skillsPage.description} />
      <StackSkillsView skills={skills} copy={{ empty: t.skillsPage.empty }} />
    </div>
  )
}

export async function generateMetadata({ params }: { params: Promise<{ segment: string }> }): Promise<Metadata> {
  const locale = await resolveSegmentLocale(params)
  const t = await getDictionary(locale)
  return {
    title: t.skillsPage.meta.title,
    description: t.skillsPage.meta.description,
    ...(await localizedPageSeo(locale, "/skills")),
  }
}

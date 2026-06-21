import type { Metadata } from "next"

import { API } from "@/api/server"
import { PageIntro } from "@/app/(home)/[segment]/_ui/page-intro"
import { StackSkillsView } from "@/app/(home)/[segment]/_ui/page/stack-skills-view"
import { getDictionary } from "@/i18n/get-dictionary"
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
      <StackSkillsView skills={skills} />
    </div>
  )
}

export async function generateMetadata({ params }: { params: Promise<{ segment: string }> }): Promise<Metadata> {
  const locale = await resolveSegmentLocale(params)
  const t = await getDictionary(locale)
  return {
    title: t.skillsPage.meta.title,
    description: t.skillsPage.meta.description,
  }
}

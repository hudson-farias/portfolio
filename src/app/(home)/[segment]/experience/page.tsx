import type { Metadata } from "next"

import { API } from "@/api/server"
import { PageIntro } from "@/app/(home)/[segment]/_ui/page-intro"
import { Experiences } from "@/app/(home)/[segment]/_ui/page/experiences"
import { getDictionary } from "@/i18n/get-dictionary"
import { resolveSegmentLocale } from "@/i18n/segment-locale"

import type { ExperiencesResponse } from "./interfaces"

export default async function ExperienceRoutePage({ params }: { params: Promise<{ segment: string }> }) {
  const locale = await resolveSegmentLocale(params)
  const t = await getDictionary(locale)
  const response = await API.get("/landpage/experiences", { locale })
  if (!response.ok) throw new Error(t.errors.experienceLoad)

  const { experiences }: ExperiencesResponse = await response.json()

  return (
    <div className="space-y-10">
      <PageIntro title={t.experience.title} description={t.experience.description} />
      <Experiences experiences={experiences} embedded />
    </div>
  )
}

export async function generateMetadata({ params }: { params: Promise<{ segment: string }> }): Promise<Metadata> {
  const locale = await resolveSegmentLocale(params)
  const t = await getDictionary(locale)
  return {
    title: t.experience.meta.title,
    description: t.experience.meta.description,
  }
}

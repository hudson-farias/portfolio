import type { Metadata } from "next"

import { API } from "@/api/server"
import { PageIntro } from "@/app/(home)/[segment]/_ui/page-intro"
import { FrameworksView } from "@/app/(home)/[segment]/_ui/page/frameworks-view"
import { getDictionary } from "@/i18n/get-dictionary"
import { resolveSegmentLocale } from "@/i18n/segment-locale"

import type { FrameworksResponse } from "./interfaces"

export default async function FrameworksRoutePage({ params }: { params: Promise<{ segment: string }> }) {
  const locale = await resolveSegmentLocale(params)
  const t = await getDictionary(locale)
  const response = await API.get("/landpage/frameworks", { locale })
  if (!response.ok) throw new Error(t.errors.frameworksLoad)

  const { frameworks }: FrameworksResponse = await response.json()

  return (
    <div className="space-y-10">
      <PageIntro title={t.frameworks.title} description={t.frameworks.description} />
      <FrameworksView frameworks={frameworks} />
    </div>
  )
}

export async function generateMetadata({ params }: { params: Promise<{ segment: string }> }): Promise<Metadata> {
  const locale = await resolveSegmentLocale(params)
  const t = await getDictionary(locale)
  return {
    title: t.frameworks.meta.title,
    description: t.frameworks.meta.description,
  }
}

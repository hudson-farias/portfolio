import type { Metadata } from "next"

import { API } from "@/api/server"
import { Tools } from "@/themes/default/page/tools"
import { PageIntro } from "@/themes/default/page-intro"
import { getDictionary } from "@/i18n/get-dictionary"
import { localizedPageSeo } from "@/i18n/seo"
import { resolveSegmentLocale } from "@/i18n/segment-locale"

import type { ToolsResponse } from "./interfaces"

export default async function ToolsRoutePage({ params }: { params: Promise<{ segment: string }> }) {
  const locale = await resolveSegmentLocale(params)
  const t = await getDictionary(locale)
  const response = await API.get("/landpage/tools", { locale })
  if (!response.ok) throw new Error(t.errors.toolsLoad)

  const { tools }: ToolsResponse = await response.json()

  return (
    <div className="space-y-10">
      <PageIntro title={t.toolsPage.title} description={t.toolsPage.description} />
      <Tools
        tools={tools}
        copy={t.tools}
        common={{ opensInNewTab: t.common.opensInNewTab }}
        embedded
      />
    </div>
  )
}

export async function generateMetadata({ params }: { params: Promise<{ segment: string }> }): Promise<Metadata> {
  const locale = await resolveSegmentLocale(params)
  const t = await getDictionary(locale)
  return {
    title: t.toolsPage.meta.title,
    description: t.toolsPage.meta.description,
    ...(await localizedPageSeo(locale, "/tools")),
  }
}

import type { Metadata } from "next"

import { API } from "@/api/server"
import { getDictionary } from "@/i18n/get-dictionary"
import { localizedRoutes } from "@/i18n/routes"
import { localizedPageSeo } from "@/i18n/seo"
import { resolveSegmentLocale } from "@/i18n/segment-locale"
import { resolveTheme } from "@/themes/resolve"
import { getUiThemeId } from "@/themes/ui-theme.server"

import type { FrameworksResponse } from "./interfaces"

export default async function FrameworksRoutePage({ params }: { params: Promise<{ segment: string }> }) {
  const locale = await resolveSegmentLocale(params)
  const themeId = await getUiThemeId()
  const { PageIntro, FrameworksView, ContactCallout } = resolveTheme(themeId)
  const t = await getDictionary(locale)
  const routes = localizedRoutes(locale)
  const response = await API.get("/landpage/frameworks", { locale })
  if (!response.ok) throw new Error(t.errors.frameworksLoad)

  const { frameworks }: FrameworksResponse = await response.json()

  return (
    <div className="space-y-10">
      <PageIntro
        title={t.frameworks.title}
        description={t.frameworks.description}
        eyebrow={`04 / ${t.frameworks.title}`}
      />
      <FrameworksView frameworks={frameworks} copy={t.frameworks} common={t.common} />
      <ContactCallout
        href={routes.contact}
        title={t.contact.callout.title}
        description={t.contact.callout.description}
        ctaLabel={t.contact.submit}
      />
    </div>
  )
}

export async function generateMetadata({ params }: { params: Promise<{ segment: string }> }): Promise<Metadata> {
  const locale = await resolveSegmentLocale(params)
  const t = await getDictionary(locale)
  return {
    title: t.frameworks.meta.title,
    description: t.frameworks.meta.description,
    ...(await localizedPageSeo(locale, "/frameworks")),
  }
}

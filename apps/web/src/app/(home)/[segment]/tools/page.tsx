import type { Metadata } from "next"

import { API } from "@/api/server"
import { getDictionary } from "@/i18n/get-dictionary"
import { localizedRoutes } from "@/i18n/routes"
import { localizedPageSeo } from "@/i18n/seo"
import { resolveSegmentLocale } from "@/i18n/segment-locale"
import { resolveTheme } from "@/themes/resolve"
import { getUiThemeId } from "@/themes/ui-theme.server"

import type { ToolsResponse } from "./interfaces"

export default async function ToolsRoutePage({ params }: { params: Promise<{ segment: string }> }) {
  const locale = await resolveSegmentLocale(params)
  const themeId = await getUiThemeId()
  const { PageIntro, Tools, ContactCallout } = resolveTheme(themeId)
  const t = await getDictionary(locale)
  const routes = localizedRoutes(locale)
  const response = await API.get("/landpage/tools", { locale })
  if (!response.ok) throw new Error(t.errors.toolsLoad)

  const { tools }: ToolsResponse = await response.json()

  return (
    <div className="space-y-10">
      <PageIntro
        title={t.toolsPage.title}
        description={t.toolsPage.description}
        eyebrow={`06 / ${t.nav.tools}`}
      />
      <Tools
        tools={tools}
        copy={t.tools}
        common={{ opensInNewTab: t.common.opensInNewTab }}
        embedded
      />
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
    title: t.toolsPage.meta.title,
    description: t.toolsPage.meta.description,
    ...(await localizedPageSeo(locale, "/tools")),
  }
}

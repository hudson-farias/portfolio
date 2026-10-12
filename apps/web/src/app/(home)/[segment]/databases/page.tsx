import type { Metadata } from "next"

import { API } from "@/api/server"
import { getDictionary } from "@/i18n/get-dictionary"
import { localizedRoutes } from "@/i18n/routes"
import { localizedPageSeo } from "@/i18n/seo"
import { resolveSegmentLocale } from "@/i18n/segment-locale"
import { resolveTheme } from "@/themes/resolve"
import { getUiThemeId } from "@/themes/ui-theme.server"

import type { DatabasesResponse } from "./interfaces"

export default async function DatabasesRoutePage({ params }: { params: Promise<{ segment: string }> }) {
  const locale = await resolveSegmentLocale(params)
  const themeId = await getUiThemeId()
  const { PageIntro, DatabasesView, ContactCallout } = resolveTheme(themeId)
  const t = await getDictionary(locale)
  const routes = localizedRoutes(locale)
  const response = await API.get("/landpage/databases", { locale })
  if (!response.ok) throw new Error(t.errors.databasesLoad)

  const { databases }: DatabasesResponse = await response.json()

  return (
    <div className="space-y-10">
      <PageIntro
        title={t.databases.title}
        description={t.databases.description}
        eyebrow={`05 / ${t.databases.title}`}
      />
      <DatabasesView
        databases={databases}
        copy={t.databases}
        common={{ sql: t.common.sql, nosql: t.common.nosql }}
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
    title: t.databases.meta.title,
    description: t.databases.meta.description,
    ...(await localizedPageSeo(locale, "/databases")),
  }
}

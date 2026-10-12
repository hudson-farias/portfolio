import type { Metadata } from "next"

import { API } from "@/api/server"
import { DatabasesView } from "@/themes/default/page/databases-view"
import { PageIntro } from "@/themes/default/page-intro"
import { getDictionary } from "@/i18n/get-dictionary"
import { localizedPageSeo } from "@/i18n/seo"
import { resolveSegmentLocale } from "@/i18n/segment-locale"

import type { DatabasesResponse } from "./interfaces"

export default async function DatabasesRoutePage({ params }: { params: Promise<{ segment: string }> }) {
  const locale = await resolveSegmentLocale(params)
  const t = await getDictionary(locale)
  const response = await API.get("/landpage/databases", { locale })
  if (!response.ok) throw new Error(t.errors.databasesLoad)

  const { databases }: DatabasesResponse = await response.json()

  return (
    <div className="space-y-10">
      <PageIntro title={t.databases.title} description={t.databases.description} />
      <DatabasesView
        databases={databases}
        copy={t.databases}
        common={{ sql: t.common.sql, nosql: t.common.nosql }}
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

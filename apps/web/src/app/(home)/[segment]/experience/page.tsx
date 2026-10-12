import type { Metadata } from "next"

import { API } from "@/api/server"
import { getDictionary } from "@/i18n/get-dictionary"
import { localizedRoutes } from "@/i18n/routes"
import { localizedPageSeo } from "@/i18n/seo"
import { resolveSegmentLocale } from "@/i18n/segment-locale"
import { resolveTheme } from "@/themes/resolve"
import { getUiThemeId } from "@/themes/ui-theme.server"

import type { ExperiencesResponse } from "./interfaces"

export default async function ExperienceRoutePage({ params }: { params: Promise<{ segment: string }> }) {
  const locale = await resolveSegmentLocale(params)
  const themeId = await getUiThemeId()
  const { PageIntro, Experiences, ContactCallout } = resolveTheme(themeId)
  const t = await getDictionary(locale)
  const routes = localizedRoutes(locale)
  const response = await API.get("/landpage/experiences", { locale })
  if (!response.ok) throw new Error(t.errors.experienceLoad)

  const { experiences }: ExperiencesResponse = await response.json()

  return (
    <div className="space-y-10">
      <PageIntro title={t.experience.title} description={t.experience.description} />
      <Experiences experiences={experiences} copy={t.experience} embedded />
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
    title: t.experience.meta.title,
    description: t.experience.meta.description,
    ...(await localizedPageSeo(locale, "/experience")),
  }
}

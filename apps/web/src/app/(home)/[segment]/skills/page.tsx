import type { Metadata } from "next"

import { API } from "@/api/server"
import { getDictionary } from "@/i18n/get-dictionary"
import { localizedRoutes } from "@/i18n/routes"
import { localizedPageSeo } from "@/i18n/seo"
import { resolveSegmentLocale } from "@/i18n/segment-locale"
import { resolveTheme } from "@/themes/resolve"
import { getUiThemeId } from "@/themes/ui-theme.server"

import type { SkillsResponse } from "./interfaces"

export default async function SkillsRoutePage({ params }: { params: Promise<{ segment: string }> }) {
  const locale = await resolveSegmentLocale(params)
  const themeId = await getUiThemeId()
  const { PageIntro, StackSkillsView, ContactCallout } = resolveTheme(themeId)
  const t = await getDictionary(locale)
  const routes = localizedRoutes(locale)
  const response = await API.get("/landpage/skills", { locale })
  if (!response.ok) throw new Error(t.errors.skillsLoad)

  const { skills }: SkillsResponse = await response.json()

  return (
    <div className="space-y-10">
      <PageIntro
        title={t.skillsPage.title}
        description={t.skillsPage.description}
        eyebrow={`07 / ${t.skillsPage.title}`}
      />
      <StackSkillsView skills={skills} copy={{ empty: t.skillsPage.empty }} />
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
    title: t.skillsPage.meta.title,
    description: t.skillsPage.meta.description,
    ...(await localizedPageSeo(locale, "/skills")),
  }
}

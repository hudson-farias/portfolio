import type { Metadata } from "next"

import { API } from "@/api/server"
import { getDictionary } from "@/i18n/get-dictionary"
import { localizedPageSeo } from "@/i18n/seo"
import { resolveSegmentLocale } from "@/i18n/segment-locale"
import { resolveTheme } from "@/themes/resolve"
import { getUiThemeId } from "@/themes/ui-theme.server"

import type { ContactLayoutResponse } from "./interfaces"

export default async function ContactRoutePage({ params }: { params: Promise<{ segment: string }> }) {
  const locale = await resolveSegmentLocale(params)
  const themeId = await getUiThemeId()
  const { PageIntro, Contact } = resolveTheme(themeId)
  const t = await getDictionary(locale)
  const response = await API.get("/landpage/layout", { locale })
  if (!response.ok) throw new Error(t.errors.contactLoad)

  const { contact }: ContactLayoutResponse = await response.json()

  return (
    <div className="space-y-10">
      <PageIntro title={t.contact.title} description={t.contact.description} eyebrow={`04 / ${t.contact.title}`} />
      <Contact contact={contact} copy={t.contact} embedded />
    </div>
  )
}

export async function generateMetadata({ params }: { params: Promise<{ segment: string }> }): Promise<Metadata> {
  const locale = await resolveSegmentLocale(params)
  const t = await getDictionary(locale)
  return {
    title: t.contact.meta.title,
    description: t.contact.meta.description,
    ...(await localizedPageSeo(locale, "/contact")),
  }
}

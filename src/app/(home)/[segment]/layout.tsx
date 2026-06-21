import type { Metadata } from "next"

import { API } from "@/api/server"
import { Footer } from "@/app/(home)/[segment]/_ui/layout/footer"
import { Header } from "@/app/(home)/[segment]/_ui/layout/header"
import { getDictionary } from "@/i18n/get-dictionary"
import type { Locale } from "@/i18n/locales"
import { localizedRoutes } from "@/i18n/routes"
import { generateSegmentStaticParams, resolveSegmentLocale } from "@/i18n/segment-locale"
import { SiteLocaleProvider } from "@/i18n/site-locale-provider"
import { getRequestOrigin } from "@/lib/request-origin"

import type { LayoutResponse } from "./layout.interfaces"
import { generateLandpageMetadata } from "./metadata"

export const generateStaticParams = generateSegmentStaticParams


const JsonLd = async ({ locale }: { locale: Locale }) => {
  const siteUrl = await getRequestOrigin()

  const response = await API.get("/landpage/layout", { locale })
  if (!response.ok) return null

  const { hero, footer, contact }: LayoutResponse = await response.json()

  const sameAs = [
    contact.linkedin,
    contact.github,
    contact.gitlab,
    contact.whatsapp_url,
    ...footer.social_networks.map((network) => network.url),
    ...contact.others.map((network) => network.url),
  ]

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: hero.profile.name,
    description: hero.profile.about,
    jobTitle: hero.profile.roles[0] ?? undefined,
    url: siteUrl,
    email: contact.email,
    address: { "@type": "PostalAddress", addressLocality: hero.profile.location },
    sameAs: [...new Set(sameAs.filter(Boolean))],
  }

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
}

export async function generateMetadata({ params }: { params: Promise<{ segment: string }> }): Promise<Metadata> {
  const locale = await resolveSegmentLocale(params)
  return generateLandpageMetadata(locale)
}

export default async function SegmentLayout({ children, params }: { children: React.ReactNode; params: Promise<{ segment: string }> }) {
  const locale = await resolveSegmentLocale(params)

  const t = await getDictionary(locale)
  const response = await API.get("/landpage/layout", { locale })
  if (!response.ok) throw new Error("Não foi possível carregar o layout.")

  const { footer, hero }: LayoutResponse = await response.json()
  const routes = localizedRoutes(locale)

  return (
    <>
      <JsonLd locale={locale} />

      <SiteLocaleProvider locale={locale} t={t} routes={routes}>
        <div className="flex min-h-screen w-full flex-col">
          <Header />

          <main className="mx-auto flex w-full max-w-6xl flex-col gap-24 px-6 py-10 md:px-10 md:py-14">
            {children}
          </main>

          <Footer profileName={hero.profile.name} profileTagline={hero.profile.about} footer={footer} />
        </div>
      </SiteLocaleProvider>
    </>
  )
}

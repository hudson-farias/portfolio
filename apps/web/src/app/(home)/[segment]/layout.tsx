import type { Metadata } from "next"

import { API } from "@/api/server"
import { themes } from "@/themes"
import { resolveTheme } from "@/themes/resolve"
import { getUiThemeId } from "@/themes/ui-theme.server"
import { getDictionary } from "@/i18n/get-dictionary"
import type { Locale } from "@/i18n/locales"
import { localizedRoutes } from "@/i18n/routes"
import { generateSegmentStaticParams, resolveSegmentLocale } from "@/i18n/segment-locale"
import { SiteLocaleProvider } from "@/i18n/site-locale-provider"
import { getRequestOrigin } from "@/lib/request-origin"

import type { LayoutResponse } from "./layout.interfaces"
import { generateLandpageMetadata } from "./metadata"
import { ThemeHeader } from "./theme-header"

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
  const themeId = await getUiThemeId()
  const { Header, Footer } = resolveTheme(themeId)

  const t = await getDictionary(locale)
  const response = await API.get("/landpage/layout", { locale })
  if (!response.ok) throw new Error("Não foi possível carregar o layout.")

  const { footer, hero }: LayoutResponse = await response.json()
  const routes = localizedRoutes(locale)

  const navItems = [
    { label: t.nav.about, href: routes.home },
    { label: t.nav.experience, href: routes.experience },
    { label: t.nav.projects, href: routes.projects },
    { label: t.nav.frameworks, href: routes.frameworks },
    { label: t.nav.databases, href: routes.databases },
    { label: t.nav.tools, href: routes.tools },
    { label: t.nav.skills, href: routes.skills },
    { label: t.nav.contact, href: routes.contact },
  ]

  const pageLinks = [
    { label: t.footerLinks.about, href: routes.home },
    { label: t.footerLinks.tools, href: routes.tools },
    { label: t.footerLinks.experience, href: routes.experience },
    { label: t.footerLinks.projects, href: routes.projects },
    { label: t.footerLinks.resume, href: routes.resume },
    { label: t.footerLinks.contact, href: routes.contact },
  ]

  const stackLinks = [
    { label: t.footerLinks.frameworks, href: routes.frameworks },
    { label: t.footerLinks.databases, href: routes.databases },
    { label: t.footerLinks.skills, href: routes.skills },
  ]

  const uiThemes = themes.map((theme) => ({
    id: theme.id,
    label: theme.label,
  }))

  const mainClassName =
    themeId === "noir-blue"
      ? "mx-auto flex w-full max-w-[1280px] flex-col gap-0 px-4 pb-10 sm:px-8 md:pb-14 lg:px-20"
      : "mx-auto flex w-full max-w-6xl flex-col gap-24 px-6 py-10 md:px-10 md:py-14"

  return (
    <>
      <JsonLd locale={locale} />

      <SiteLocaleProvider locale={locale} t={t} routes={routes}>
        <div
          data-ui-theme={themeId}
          className={
            themeId === "noir-blue"
              ? "flex min-h-screen w-full flex-col bg-background text-foreground"
              : "flex min-h-screen w-full flex-col"
          }
        >
          <ThemeHeader
            Header={Header}
            homeHref={routes.home}
            homeAriaLabel={t.nav.home}
            navItems={navItems}
            locale={locale}
            adminHref="/admin"
            adminLabel={t.nav.admin}
            uiThemes={uiThemes}
            selectedThemeId={themeId}
          />

          <main className={mainClassName}>{children}</main>

          <Footer
            profileName={hero.profile.name}
            profileTagline={hero.profile.about}
            footer={footer}
            copy={t.footer}
            pageLinks={pageLinks}
            stackLinks={stackLinks}
          />
        </div>
      </SiteLocaleProvider>
    </>
  )
}

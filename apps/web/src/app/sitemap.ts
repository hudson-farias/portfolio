import type { MetadataRoute } from "next"

import { getRequestOrigin } from "@/lib/request-origin"
import { locales } from "@/i18n/locales"
import { localizedRoutes, type SiteRoutes } from "@/i18n/routes"
import { buildLanguageAlternates, type PathSuffix } from "@/i18n/seo"

export const dynamic = "force-dynamic"

const paths = [
  "home",
  "frameworks",
  "databases",
  "skills",
  "tools",
  "experience",
  "projects",
  "contact",
  "resume",
] as const satisfies ReadonlyArray<keyof SiteRoutes>

function pathSuffixFor(key: keyof SiteRoutes, locale: (typeof locales)[number]): PathSuffix {
  const route = localizedRoutes(locale)[key]
  const prefix = `/${locale}`
  if (route === prefix) return ""
  return route.slice(prefix.length) as PathSuffix
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = await getRequestOrigin()

  const entries: MetadataRoute.Sitemap = []

  for (const locale of locales) {
    const routes = localizedRoutes(locale)

    for (const key of paths) {
      const pathSuffix = pathSuffixFor(key, locale)

      entries.push({
        url: `${siteUrl}${routes[key]}`,
        lastModified: new Date(),
        changeFrequency: key === "home" ? "weekly" : "monthly",
        priority: key === "home" ? 1 : 0.8,
        alternates: {
          languages: buildLanguageAlternates(siteUrl, pathSuffix),
        },
      })
    }
  }

  return entries
}

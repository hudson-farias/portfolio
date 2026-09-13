import type { MetadataRoute } from "next"

import { getRequestOrigin } from "@/lib/request-origin"
import { localizedRoutes } from "@/i18n/routes"

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
] as const

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = await getRequestOrigin()

  const entries: MetadataRoute.Sitemap = []

  for (const locale of ["pt", "en"] as const) {
    const routes = localizedRoutes(locale)

    for (const key of paths) {
      entries.push({
        url: `${siteUrl}${routes[key]}`,
        lastModified: new Date(),
        changeFrequency: key === "home" ? "weekly" : "monthly",
        priority: key === "home" ? 1 : 0.8,
      })
    }
  }

  return entries
}

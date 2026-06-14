import type { MetadataRoute } from "next"

import { getRequestOrigin } from "@/lib/request-origin"

export const dynamic = "force-dynamic"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = await getRequestOrigin()

  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
  ]
}

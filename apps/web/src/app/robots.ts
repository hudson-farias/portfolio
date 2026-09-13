import type { MetadataRoute } from "next"

import { getRequestOrigin } from "@/lib/request-origin"

export const dynamic = "force-dynamic"

export default async function robots(): Promise<MetadataRoute.Robots> {
  const siteUrl = await getRequestOrigin()

  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  }
}

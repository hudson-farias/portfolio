import type { Metadata } from "next"

import { API } from "@/api/server"
import { getRequestOrigin } from "@/lib/request-origin"
import type { Locale } from "@/i18n/locales"
import { localeToOpenGraph } from "@/i18n/locales"

import type { MetadataResponse } from "./layout.interfaces"

export const generateLandpageMetadata = async (locale: Locale): Promise<Metadata> => {
  const siteUrl = await getRequestOrigin()

  const fallback: Metadata = {
    metadataBase: new URL(siteUrl),
    title: "Portfólio",
    description: "Portfólio pessoal com projetos, habilidades e contato.",
  }

  const response = await API.get("/landpage/metadata", { locale })
  if (!response.ok) return fallback

  const metadata: MetadataResponse = await response.json()

  const roleLabel = metadata.roles.slice(0, 2).join(", ")
  const title = roleLabel ? `${metadata.name} — ${roleLabel}` : metadata.name
  const description = metadata.about

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: title,
      template: `%s | ${metadata.name}`,
    },
    description,
    openGraph: {
      type: "website",
      locale: localeToOpenGraph(locale),
      url: siteUrl,
      siteName: metadata.name,
      title,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    alternates: {
      canonical: siteUrl,
    },
  }
}

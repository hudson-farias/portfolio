import type { Metadata } from "next"

import { getRequestOrigin } from "@/lib/request-origin"

import { defaultLocale, locales, localeToOpenGraph, type Locale } from "./locales"

/** Path after the locale segment, e.g. `""` (home) or `"/projects"`. */
export type PathSuffix = "" | `/${string}`

export function buildLocalizedUrl(origin: string, locale: Locale, pathSuffix: PathSuffix = ""): string {
  const base = origin.replace(/\/$/, "")
  const suffix = pathSuffix === "/" ? "" : pathSuffix
  return `${base}/${locale}${suffix}`
}

export function buildLanguageAlternates(
  origin: string,
  pathSuffix: PathSuffix = "",
): Record<string, string> {
  const base = origin.replace(/\/$/, "")
  const suffix = pathSuffix === "/" ? "" : pathSuffix

  return {
    pt: `${base}/pt${suffix}`,
    en: `${base}/en${suffix}`,
    "x-default": `${base}/${defaultLocale}${suffix}`,
  }
}

/**
 * Maps Accept-Language to a supported locale.
 * Prefers the highest-q tag that starts with `pt` or `en`; falls back to `defaultLocale`.
 */
export function negotiateLocale(acceptLanguageHeader: string | null | undefined): Locale {
  if (!acceptLanguageHeader) return defaultLocale

  const preferred = acceptLanguageHeader
    .split(",")
    .map((part) => {
      const [rawTag, qValue] = part.trim().split(";q=")
      const tag = rawTag?.trim().toLowerCase() ?? ""
      const q = qValue !== undefined ? Number(qValue) : 1
      return { tag, q: Number.isFinite(q) ? q : 0 }
    })
    .filter((entry) => entry.tag.length > 0)
    .sort((a, b) => b.q - a.q)

  for (const { tag } of preferred) {
    if (tag === "*") continue
    if (tag === "pt" || tag.startsWith("pt-")) return "pt"
    if (tag === "en" || tag.startsWith("en-")) return "en"
  }

  return defaultLocale
}

export function buildAlternateLocales(locale: Locale): string[] {
  return locales.filter((l) => l !== locale).map(localeToOpenGraph)
}

/** Canonical + hreflang + Open Graph locale fields for a localized page. */
export async function localizedPageSeo(
  locale: Locale,
  pathSuffix: PathSuffix = "",
): Promise<Pick<Metadata, "alternates" | "openGraph">> {
  const origin = await getRequestOrigin()
  const url = buildLocalizedUrl(origin, locale, pathSuffix)

  return {
    alternates: {
      canonical: url,
      languages: buildLanguageAlternates(origin, pathSuffix),
    },
    openGraph: {
      url,
      locale: localeToOpenGraph(locale),
      alternateLocale: buildAlternateLocales(locale),
    },
  }
}

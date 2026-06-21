export const locales = ["pt", "en"] as const

export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = "pt"

export function localeToHtmlLang(locale: Locale): string {
  return locale === "en" ? "en" : "pt-BR"
}

export function localeToOpenGraph(locale: Locale): string {
  return locale === "en" ? "en_US" : "pt_BR"
}

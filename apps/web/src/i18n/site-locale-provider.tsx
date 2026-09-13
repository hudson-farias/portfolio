"use client"

import { createContext, useContext } from "react"

import type { Dictionary } from "./dictionary"
import type { Locale } from "./locales"
import type { SiteRoutes } from "./routes"

type SiteLocaleContextValue = {
  locale: Locale
  t: Dictionary
  routes: SiteRoutes
}

const SiteLocaleContext = createContext<SiteLocaleContextValue | null>(null)

export function SiteLocaleProvider({
  locale,
  t,
  routes,
  children,
}: SiteLocaleContextValue & { children: React.ReactNode }) {
  return (
    <SiteLocaleContext.Provider value={{ locale, t, routes }}>
      {children}
    </SiteLocaleContext.Provider>
  )
}

export function useSiteLocale() {
  const value = useContext(SiteLocaleContext)

  if (!value) {
    throw new Error("useSiteLocale must be used within SiteLocaleProvider")
  }

  return value
}

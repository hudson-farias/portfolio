import type { Locale } from "./locales"

export type SiteRoutes = {
  home: string
  frameworks: string
  databases: string
  skills: string
  tools: string
  experience: string
  projects: string
  contact: string
  resume: string
}

export function localizedRoutes(locale: Locale): SiteRoutes {
  const prefix = `/${locale}`

  return {
    home: prefix,
    frameworks: `${prefix}/frameworks`,
    databases: `${prefix}/databases`,
    skills: `${prefix}/skills`,
    tools: `${prefix}/tools`,
    experience: `${prefix}/experience`,
    projects: `${prefix}/projects`,
    contact: `${prefix}/contact`,
    resume: `${prefix}/resume`,
  }
}

export function switchLocalePath(pathname: string, target: Locale): string {
  const normalized = pathname.replace(/\/$/, "") || "/"
  const match = normalized.match(/^\/(pt|en)(\/.*)?$/)

  if (!match) {
    return `/${target}`
  }

  const pathSuffix = match[2] ?? ""
  return `/${target}${pathSuffix}`
}

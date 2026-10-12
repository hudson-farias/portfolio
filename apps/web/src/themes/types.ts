import type { ReactNode } from "react"

import type {
  AboutResponse,
  AboutStats,
  ContactResponse,
  ExperiencesResponse,
  HeroProfile,
  HeroResponse,
  PageResponse,
  ProjectsResponse,
  SkillsResponse,
  Stats,
  ToolsResponse,
} from "@/app/(home)/[segment]/interfaces"
import type {
  ContactResponse as LayoutContactResponse,
  FooterResponse,
  HeroResponse as LayoutHeroResponse,
  LayoutResponse,
} from "@/app/(home)/[segment]/layout.interfaces"
import type { Dictionary } from "@/i18n/dictionary"
import type { Locale } from "@/i18n/locales"
import type { Database, Experience, Framework, Project, Skill, SocialNetwork, Tool } from "@/types"

import type { ThemeId } from "./index"

export type {
  AboutResponse,
  AboutStats,
  ContactResponse,
  ExperiencesResponse,
  HeroProfile,
  HeroResponse,
  PageResponse,
  ProjectsResponse,
  SkillsResponse,
  Stats,
  ToolsResponse,
  FooterResponse,
  LayoutContactResponse,
  LayoutHeroResponse,
  LayoutResponse,
  Database,
  Experience,
  Framework,
  Project,
  Skill,
  SocialNetwork,
  Tool,
}

/** Nav labels (section copy bag). */
export type NavCopy = Dictionary["nav"]

/** Hero section copy bag. */
export type HeroCopy = Dictionary["hero"]

/** About section copy bag. */
export type AboutCopy = Dictionary["about"]

/** Experiences section copy bag (`experience` in dictionary). */
export type ExperiencesCopy = Dictionary["experience"]

/** Projects section copy bag. */
export type ProjectsCopy = Dictionary["projects"]

/** Stack / frameworks home section copy bag. */
export type StackCopy = Dictionary["stackTech"]

/** Databases section copy bag (home stack + dedicated page empties). */
export type DatabasesCopy = Dictionary["stackDatabases"] &
  Partial<Pick<Dictionary["databases"], "empty" | "meta">>

/** Tools section copy bag. */
export type ToolsCopy = Dictionary["tools"]

/** Skills section copy bag (home stack). */
export type SkillsCopy = Dictionary["stackSkills"]

/** Contact section copy bag. */
export type ContactCopy = Dictionary["contact"]

/** Footer column headings + rights. */
export type FooterCopy = Dictionary["footer"]

/** Footer page/stack link labels. */
export type FooterLinksCopy = Dictionary["footerLinks"]

export type NavItem = {
  label: string
  href: string
}

export type LocaleOption = {
  code: Locale
  href: string
}

export type UiThemeOption = {
  id: ThemeId
  label: string
}

export type HeaderProps = {
  homeHref: string
  homeAriaLabel: string
  navItems: NavItem[]
  locale: Locale
  localeOptions: LocaleOption[]
  adminHref: string
  adminLabel: string
  uiThemes: UiThemeOption[]
  selectedThemeId: ThemeId
  onUiThemeChange?: (themeId: ThemeId) => void
}

export type FooterProps = {
  profileName: string
  profileTagline: string
  footer: FooterResponse
  copy: FooterCopy
  pageLinks: NavItem[]
  stackLinks: NavItem[]
}

/** Dedicated-page bottom CTA linking to the contact route (Noir Blue). */
export type ContactCalloutProps = {
  href: string
  title: string
  description: string
  ctaLabel: string
}

export type LandpageShellProps = {
  children: ReactNode
  header: HeaderProps
  footer: FooterProps
}

export type HomePageProps = {
  hero: {
    profile: HeroProfile
    copy: HeroCopy
    contactHref: string
    resumeHref: string
  }
  about: {
    aboutExtended: string
    stats: AboutStats | Stats
    linkedin: string
    socialNetworks: SocialNetwork[]
    profileName: string
    copy: AboutCopy
  }
  experiences: {
    experiences: Experience[]
    copy: ExperiencesCopy
    limit?: number
    ctaHref?: string
  }
  projects: {
    projects: Project[]
    copy: ProjectsCopy
    limit?: number
    ctaHref?: string
  }
  stack: {
    frameworks: Framework[]
    copy: StackCopy
    frameworksHref: string
    limit?: number
  }
  databases: {
    databases: Database[]
    copy: DatabasesCopy
    databasesHref: string
    limit?: number
  }
  tools: {
    tools: Tool[]
    copy: ToolsCopy
    limit?: number
    ctaHref?: string
  }
  skills: {
    skills: Skill[]
    copy: SkillsCopy
    skillsHref: string
    limit?: number
  }
  contact?: {
    contact: ContactResponse
    copy: ContactCopy
  }
}

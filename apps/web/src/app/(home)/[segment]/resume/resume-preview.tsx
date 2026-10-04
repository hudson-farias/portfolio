"use client"

import { useMemo } from "react"

import { SanitizedHtml } from "@/components/sanitized-html"
import { useSiteLocale } from "@/i18n/site-locale-provider"
import { FRAMEWORK_SCOPES, siteFrameworkScopeLabel } from "@/lib/framework-scope"
import { formatWhatsAppDisplay } from "@/lib/admin/whatsapp-mask"
import {
  filterDatabasesForResume,
  filterExperiencesForResume,
  filterFrameworksForResume,
  filterSkillsForResume,
  filterToolsForResume,
  languagesForResume,
  type ResumeFilterState,
} from "@/lib/resume-filters"
import type { Database, Experience, Framework, ResumeRole, Skill, Tool } from "@/types"

export type ResumePreviewProfile = {
  name: string
  roles: string[]
  location: string
  email: string
  whatsapp: string
  aboutMe: string
}

function frameworkLabel(framework: Framework) {
  return framework.name
}

export function ResumePreview({
  profile,
  skills,
  frameworks,
  languages = [],
  databases,
  tools,
  experiences,
  roles = [],
  experienceRoleOverrides = {},
  headerRoleIds = null,
  filters,
  includeSummary = true,
  summaryOverride = null,
  portfolioUrl = null,
}: {
  profile: ResumePreviewProfile
  skills: Skill[]
  frameworks: Framework[]
  languages?: { id: number; name: string }[]
  databases: Database[]
  tools: Tool[]
  experiences: Experience[]
  roles?: ResumeRole[]
  experienceRoleOverrides?: Record<number, number>
  headerRoleIds?: number[] | null
  filters: ResumeFilterState
  includeSummary?: boolean
  summaryOverride?: string | null
  portfolioUrl?: string | null
}) {
  const { t } = useSiteLocale()

  const visibleSkills = useMemo(() => filterSkillsForResume(skills, filters), [skills, filters])
  const visibleFrameworks = useMemo(() => filterFrameworksForResume(frameworks, filters), [frameworks, filters])
  const visibleLanguages = useMemo(
    () => languagesForResume(languages, frameworks, filters),
    [languages, frameworks, filters],
  )
  const visibleDatabases = useMemo(() => filterDatabasesForResume(databases, filters), [databases, filters])
  const visibleTools = useMemo(() => filterToolsForResume(tools, filters), [tools, filters])
  const visibleExperiences = useMemo(() => filterExperiencesForResume(experiences, filters), [experiences, filters])
  const aboutMe = includeSummary ? (summaryOverride?.trim() || profile.aboutMe) : ""

  const roleTitleById = useMemo(() => {
    const map = new Map<number, string>()
    for (const role of roles) map.set(role.id, role.title)
    return map
  }, [roles])

  const headerTitles = useMemo(() => {
    if (headerRoleIds?.length) {
      return headerRoleIds.map((id) => roleTitleById.get(id)).filter((title): title is string => Boolean(title))
    }
    return profile.roles
  }, [headerRoleIds, roleTitleById, profile.roles])

  function experienceRoleTitle(experience: Experience) {
    const overrideId = experienceRoleOverrides[experience.id]
    if (overrideId != null) {
      const title = roleTitleById.get(overrideId)
      if (title) return title
    }
    return experience.role
  }

  const frameworksByScope = useMemo(() => {
    const grouped = new Map<string, string[]>()
    for (const framework of visibleFrameworks) {
      const scope = framework.scope || "other"
      const items = grouped.get(scope) ?? []
      items.push(frameworkLabel(framework))
      grouped.set(scope, items)
    }
    return grouped
  }, [visibleFrameworks])

  const databasesByScope = useMemo(() => {
    const grouped = new Map<string, string[]>()
    for (const database of visibleDatabases) {
      const scope = database.scope || "outros"
      const items = grouped.get(scope) ?? []
      items.push(database.name)
      grouped.set(scope, items)
    }
    return grouped
  }, [visibleDatabases])

  const whatsappNumber = formatWhatsAppDisplay(profile.whatsapp)

  return (
    <article className="mx-auto w-full max-w-[210mm] bg-[#faf9f6] px-8 py-10 text-[#1a1a1a] shadow-sm ring-1 ring-black/10 sm:px-12">
      <header className="space-y-1.5 border-b border-black/15 pb-4">
        <h1 className="font-serif text-2xl font-semibold tracking-tight">{profile.name}</h1>
        {headerTitles.length > 0 ? (
          <p className="text-base text-black/80">{headerTitles.join(" | ")}</p>
        ) : null}
        {profile.location ? <p className="text-sm text-black/70">{profile.location}</p> : null}
        {portfolioUrl ? <p className="text-sm text-black/70">{portfolioUrl}</p> : null}
        {profile.email ? <p className="text-sm text-black/70">{profile.email}</p> : null}
        {whatsappNumber ? (
          <p className="text-sm text-black/70">
            {whatsappNumber}{" "}
            <span className="text-xs">({t.resume.doc.whatsappNotice})</span>
          </p>
        ) : null}
      </header>

      <div className="mt-5 space-y-5 text-[13px] leading-relaxed">
        {aboutMe ? (
          <section className="space-y-1.5">
            <h2 className="text-sm font-semibold uppercase tracking-wide">{t.resume.doc.summary}</h2>
            <SanitizedHtml
              html={aboutMe.replace(/\n/g, "<br />")}
              className="text-black/85"
            />
          </section>
        ) : null}

        {visibleLanguages.length > 0 ? (
          <section className="space-y-1.5">
            <h2 className="text-sm font-semibold uppercase tracking-wide">{t.resume.doc.languages}</h2>
            <p className="text-black/85">{visibleLanguages.map((language) => language.name).join(", ")}</p>
          </section>
        ) : null}

        {visibleFrameworks.length > 0 ? (
          <section className="space-y-1.5">
            <h2 className="text-sm font-semibold uppercase tracking-wide">{t.resume.doc.frameworks}</h2>
            <div className="space-y-1">
              {FRAMEWORK_SCOPES.map((scope) => {
                const items = frameworksByScope.get(scope)
                if (!items?.length) return null
                const label = siteFrameworkScopeLabel(scope, t.common) ?? scope
                return (
                  <p key={scope} className="text-black/85">
                    <span className="font-semibold">{label}</span>: {items.join(", ")}
                  </p>
                )
              })}
            </div>
          </section>
        ) : null}

        {visibleDatabases.length > 0 ? (
          <section className="space-y-1.5">
            <h2 className="text-sm font-semibold uppercase tracking-wide">{t.resume.doc.databases}</h2>
            <div className="space-y-1">
              {(["sql", "nosql", "outros"] as const).map((scope) => {
                const items = databasesByScope.get(scope)
                if (!items?.length) return null
                const label =
                  scope === "sql" ? t.common.sql : scope === "nosql" ? t.common.nosql : t.common.other
                return (
                  <p key={scope} className="text-black/85">
                    <span className="font-semibold">{label}</span>: {items.join(", ")}
                  </p>
                )
              })}
            </div>
          </section>
        ) : null}

        {visibleTools.length > 0 ? (
          <section className="space-y-1.5">
            <h2 className="text-sm font-semibold uppercase tracking-wide">{t.resume.doc.tools}</h2>
            <p className="text-black/85">{visibleTools.map((tool) => tool.name).join(", ")}</p>
          </section>
        ) : null}

        {visibleSkills.length > 0 ? (
          <section className="space-y-1.5">
            <h2 className="text-sm font-semibold uppercase tracking-wide">{t.resume.doc.skills}</h2>
            <p className="text-black/85">{visibleSkills.map((skill) => skill.name).join(", ")}</p>
          </section>
        ) : null}

        {visibleExperiences.length > 0 ? (
          <section className="space-y-3">
            <h2 className="text-sm font-semibold uppercase tracking-wide">{t.resume.doc.experience}</h2>
            {visibleExperiences.map((experience) => {
              const stack = (experience.frameworks ?? []).map((framework) => framework.name)
              const contractLabel = experience.contract_type
                ? t.resume.doc.contractTypes[experience.contract_type]
                : null
              const experienceTitle = [
                experience.company,
                experienceRoleTitle(experience),
                experience.period,
                contractLabel,
              ]
                .filter(Boolean)
                .join(" | ")

              return (
                <div key={experience.id} className="space-y-1">
                  <p className="font-semibold text-black/90">{experienceTitle}</p>
                  {experience.description ? (
                    <SanitizedHtml html={experience.description} className="text-black/80" />
                  ) : null}
                  {stack.length > 0 ? (
                    <p className="italic text-black/65">
                      {t.resume.doc.stack}: {stack.join(", ")}
                    </p>
                  ) : null}
                </div>
              )
            })}
          </section>
        ) : null}

        <section className="space-y-1.5">
          <h2 className="text-sm font-semibold uppercase tracking-wide">{t.resume.doc.education}</h2>
          <p className="font-semibold text-black/90">{t.resume.doc.educationEntry}</p>
        </section>
      </div>
    </article>
  )
}

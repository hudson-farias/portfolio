"use client"

import { useMemo, useState, type ReactNode } from "react"
import { Download } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Reveal } from "@/app/(home)/[segment]/_ui/reveal"
import { useSiteLocale } from "@/i18n/site-locale-provider"
import {
  buildResumeQuery,
  countSelectedDatabases,
  countSelectedFrameworks,
  defaultResumeFilters,
  uniqueLanguagesFromFrameworks,
  type ResumeFilterState,
} from "@/lib/resume-filters"
import { siteFrameworkScopeLabel } from "@/lib/framework-scope"
import type { Database, Experience, Framework, LanguageRef, Skill, Tool } from "@/types"

function toggleValue<T>(values: T[], value: T) {
  return values.includes(value) ? values.filter((item) => item !== value) : [...values, value]
}

function FilterGroup({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-3 rounded-2xl border border-border/50 bg-card/40 p-4">
      <h2 className="text-sm font-semibold">{title}</h2>
      {children}
    </section>
  )
}

function CheckboxRow({
  checked,
  label,
  hint,
  onChange,
}: {
  checked: boolean
  label: string
  hint?: string
  onChange: () => void
}) {
  return (
    <label className="flex cursor-pointer items-start gap-2 text-sm text-muted-foreground">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="mt-0.5 size-4 rounded border-border accent-primary"
      />
      <span>
        {label}
        {hint ? <span className="mt-0.5 block text-xs text-muted-foreground/80">{hint}</span> : null}
      </span>
    </label>
  )
}

export function ResumeBuilder({
  skills,
  frameworks,
  databases,
  tools,
  experiences,
  apiBaseUrl,
}: {
  skills: Skill[]
  frameworks: Framework[]
  databases: Database[]
  tools: Tool[]
  experiences: Experience[]
  apiBaseUrl: string
}) {
  const { t } = useSiteLocale()
  const [filters, setFilters] = useState<ResumeFilterState>(defaultResumeFilters())

  const languages = useMemo(() => uniqueLanguagesFromFrameworks(frameworks), [frameworks])

  const downloadUrl = useMemo(() => {
    const query = buildResumeQuery(filters)
    const base = `${apiBaseUrl.replace(/\/$/, "")}/landpage/resume`
    return query ? `${base}?${query}` : base
  }, [apiBaseUrl, filters])

  const selectedSkillsCount = useMemo(() => {
    if (filters.skillIds.length > 0) return filters.skillIds.length
    if (filters.sections.length === 0 || filters.sections.includes("skills")) return skills.length
    return 0
  }, [skills, filters.sections, filters.skillIds])

  const selectedFrameworksCount = useMemo(
    () => countSelectedFrameworks(frameworks, filters),
    [frameworks, filters],
  )

  const selectedDatabasesCount = useMemo(
    () => countSelectedDatabases(databases, filters),
    [databases, filters],
  )

  function databaseScopeLabel(scope: Database["scope"]) {
    if (scope === "sql") return t.common.sql
    if (scope === "nosql") return t.common.nosql
    return undefined
  }

  return (
    <div className="mx-auto grid w-full max-w-4xl gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <div className="space-y-4">
        {languages.length > 0 ? (
          <FilterGroup title={t.resume.languages}>
            <div className="grid max-h-48 gap-2 overflow-y-auto sm:grid-cols-2">
              {languages.map((language: LanguageRef) => (
                <CheckboxRow
                  key={language.id}
                  label={language.name}
                  checked={filters.languageIds.includes(language.id)}
                  onChange={() =>
                    setFilters((current) => ({
                      ...current,
                      languageIds: toggleValue(current.languageIds, language.id),
                    }))
                  }
                />
              ))}
            </div>
          </FilterGroup>
        ) : null}

        {frameworks.length > 0 ? (
          <FilterGroup title={t.resume.frameworks}>
            <div className="grid max-h-56 gap-2 overflow-y-auto sm:grid-cols-2">
              {frameworks.map((framework) => {
                const hint = [
                  siteFrameworkScopeLabel(framework.scope ?? null, t.common),
                  framework.languages.length > 0
                    ? framework.languages.map((language) => language.name).join(", ")
                    : undefined,
                ]
                  .filter(Boolean)
                  .join(" · ")

                return (
                  <CheckboxRow
                    key={framework.id}
                    label={framework.name}
                    hint={hint || undefined}
                    checked={filters.frameworkIds.includes(framework.id)}
                    onChange={() =>
                      setFilters((current) => ({
                        ...current,
                        frameworkIds: toggleValue(current.frameworkIds, framework.id),
                      }))
                    }
                  />
                )
              })}
            </div>
          </FilterGroup>
        ) : null}

        {databases.length > 0 ? (
          <FilterGroup title={t.resume.databases}>
            <div className="grid max-h-48 gap-2 overflow-y-auto sm:grid-cols-2">
              {databases.map((database) => (
                <CheckboxRow
                  key={database.id}
                  label={database.name}
                  hint={databaseScopeLabel(database.scope)}
                  checked={filters.databaseIds.includes(database.id)}
                  onChange={() =>
                    setFilters((current) => ({
                      ...current,
                      databaseIds: toggleValue(current.databaseIds, database.id),
                    }))
                  }
                />
              ))}
            </div>
          </FilterGroup>
        ) : null}

        {skills.length > 0 ? (
          <FilterGroup title={t.resume.skills}>
            <div className="grid max-h-56 gap-2 overflow-y-auto sm:grid-cols-2">
              {skills.map((skill) => (
                <CheckboxRow
                  key={skill.id}
                  label={skill.name}
                  checked={filters.skillIds.includes(skill.id)}
                  onChange={() =>
                    setFilters((current) => ({
                      ...current,
                      skillIds: toggleValue(current.skillIds, skill.id),
                    }))
                  }
                />
              ))}
            </div>
          </FilterGroup>
        ) : null}

        <FilterGroup title={t.resume.experiences}>
          <div className="space-y-2">
            {experiences.map((experience) => (
              <CheckboxRow
                key={experience.id}
                label={`${experience.role} — ${experience.company}`}
                checked={filters.experienceIds.includes(experience.id)}
                onChange={() =>
                  setFilters((current) => ({
                    ...current,
                    experienceIds: toggleValue(current.experienceIds, experience.id),
                  }))
                }
              />
            ))}
          </div>
        </FilterGroup>

        <FilterGroup title={t.resume.toolsSection}>
          <CheckboxRow
            label={t.resume.includeAllTools}
            checked={filters.includeTools}
            onChange={() =>
              setFilters((current) => ({
                ...current,
                includeTools: !current.includeTools,
                toolIds: !current.includeTools ? [] : current.toolIds,
              }))
            }
          />
          <div className="grid max-h-48 gap-2 overflow-y-auto sm:grid-cols-2">
            {tools.map((tool) => (
              <CheckboxRow
                key={tool.id}
                label={tool.name}
                checked={filters.toolIds.includes(tool.id)}
                onChange={() =>
                  setFilters((current) => ({
                    ...current,
                    includeTools: false,
                    toolIds: toggleValue(current.toolIds, tool.id),
                  }))
                }
              />
            ))}
          </div>
        </FilterGroup>
      </div>

      <Reveal variant="scale" className="h-fit">
        <aside className="surface space-y-4 rounded-2xl p-5 lg:sticky lg:top-28">
          <div className="space-y-2">
            <h2 className="text-lg font-semibold">{t.resume.previewTitle}</h2>
            <p className="text-sm text-muted-foreground">{t.resume.previewDescription}</p>
          </div>

          <dl className="space-y-2 text-sm">
            <div className="flex justify-between gap-3">
              <dt className="text-muted-foreground">{t.resume.languages}</dt>
              <dd>
                {filters.languageIds.length > 0
                  ? filters.languageIds.length
                  : filters.sections.length === 0 || filters.sections.includes("frameworks")
                    ? languages.length || t.resume.all
                    : t.resume.none}
              </dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-muted-foreground">{t.resume.frameworks}</dt>
              <dd>
                {filters.frameworkIds.length > 0
                  ? filters.frameworkIds.length
                  : selectedFrameworksCount || t.resume.noneMasc}
              </dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-muted-foreground">{t.resume.databases}</dt>
              <dd>
                {filters.databaseIds.length > 0
                  ? filters.databaseIds.length
                  : selectedDatabasesCount || t.resume.noneMasc}
              </dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-muted-foreground">{t.resume.skills}</dt>
              <dd>{selectedSkillsCount}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-muted-foreground">{t.resume.experiences}</dt>
              <dd>{filters.experienceIds.length || t.resume.all}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-muted-foreground">{t.resume.toolsSection}</dt>
              <dd>
                {filters.includeTools ? t.resume.allTools : filters.toolIds.length || t.resume.none}
              </dd>
            </div>
          </dl>

          <Button asChild className="w-full rounded-full">
            <a href={downloadUrl} target="_blank" rel="noopener noreferrer">
              <Download className="size-4" />
              {t.resume.generatePdf}
            </a>
          </Button>
        </aside>
      </Reveal>
    </div>
  )
}

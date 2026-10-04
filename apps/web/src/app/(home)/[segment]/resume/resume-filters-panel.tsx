"use client"

import { useEffect, useMemo, useState, type ReactNode } from "react"
import { ChevronDown } from "lucide-react"

import { useSiteLocale } from "@/i18n/site-locale-provider"
import { siteFrameworkScopeLabel } from "@/lib/framework-scope"
import { cn } from "@/lib/utils"
import {
  frameworksMatchingLanguageIds,
  pruneFrameworkIdsForLanguages,
  type ResumeFilterState,
} from "@/lib/resume-filters"
import type { Database, Experience, Framework, LanguageRef, ResumeRole, Skill, Tool } from "@/types"

type FilterSectionKey = "languages" | "frameworks" | "databases" | "tools" | "skills" | "experiences"

function toggleValue<T>(values: T[], value: T) {
  return values.includes(value) ? values.filter((item) => item !== value) : [...values, value]
}

function Chip({
  selected,
  label,
  hint,
  onClick,
}: {
  selected: boolean
  label: string
  hint?: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={hint || label}
      className={cn(
        "inline-flex max-w-full items-center rounded-full border px-2.5 py-1 text-left text-xs transition-colors",
        selected
          ? "border-primary/50 bg-primary/15 text-foreground"
          : "border-border/60 bg-background/60 text-muted-foreground hover:border-border hover:text-foreground",
      )}
    >
      <span className="truncate">{label}</span>
    </button>
  )
}

function FilterSection({
  title,
  selectedCount,
  open,
  onToggle,
  onSelectAll,
  onClear,
  search,
  onSearchChange,
  searchPlaceholder,
  children,
}: {
  title: string
  selectedCount: number
  open: boolean
  onToggle: () => void
  onSelectAll: () => void
  onClear: () => void
  search: string
  onSearchChange: (value: string) => void
  searchPlaceholder: string
  children: ReactNode
}) {
  const { t } = useSiteLocale()

  return (
    <section className="rounded-2xl border border-border/50 bg-card/40">
      <div className="flex flex-wrap items-center gap-2 px-4 py-3">
        <button
          type="button"
          onClick={onToggle}
          className="flex min-w-0 flex-1 items-center gap-2 text-left text-sm font-semibold"
        >
          <ChevronDown
            className={cn("size-4 shrink-0 text-muted-foreground transition-transform", open ? "rotate-0" : "-rotate-90")}
          />
          <span className="truncate">{title}</span>
          <span className="text-xs font-normal text-muted-foreground">({selectedCount})</span>
        </button>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onSelectAll}
            className="rounded-full px-2 py-0.5 text-xs text-muted-foreground hover:bg-background/70 hover:text-foreground"
          >
            {t.resume.filters.selectAll}
          </button>
          <button
            type="button"
            onClick={onClear}
            className="rounded-full px-2 py-0.5 text-xs text-muted-foreground hover:bg-background/70 hover:text-foreground"
          >
            {t.resume.filters.clear}
          </button>
        </div>
      </div>

      {open ? (
        <div className="space-y-3 border-t border-border/40 px-4 py-3">
          <input
            type="search"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder={searchPlaceholder}
            className="w-full rounded-xl border border-border/60 bg-background px-3 py-2 text-sm outline-none ring-primary/40 focus:ring-2"
          />
          <div className="flex max-h-56 flex-wrap gap-1.5 overflow-y-auto">{children}</div>
        </div>
      ) : null}
    </section>
  )
}

function matchesSearch(label: string, search: string) {
  const needle = search.trim().toLowerCase()
  if (!needle) return true
  return label.toLowerCase().includes(needle)
}

export function ResumeFiltersPanel({
  filters,
  onChange,
  languages,
  frameworks,
  databases,
  skills,
  experiences,
  tools,
  roles,
  experienceRoleOverrides,
}: {
  filters: ResumeFilterState
  onChange: (next: ResumeFilterState | ((current: ResumeFilterState) => ResumeFilterState)) => void
  languages: LanguageRef[]
  frameworks: Framework[]
  databases: Database[]
  skills: Skill[]
  experiences: Experience[]
  tools: Tool[]
  roles: ResumeRole[]
  experienceRoleOverrides: Record<number, number>
}) {
  const { t } = useSiteLocale()
  const [openSections, setOpenSections] = useState<Record<FilterSectionKey, boolean>>({
    languages: true,
    frameworks: true,
    databases: true,
    tools: true,
    skills: true,
    experiences: true,
  })
  const [searchBySection, setSearchBySection] = useState<Record<FilterSectionKey, string>>({
    languages: "",
    frameworks: "",
    databases: "",
    tools: "",
    skills: "",
    experiences: "",
  })

  const roleTitleById = useMemo(() => {
    const map = new Map<number, string>()
    for (const role of roles) map.set(role.id, role.title)
    return map
  }, [roles])

  const frameworksForLanguages = useMemo(
    () => frameworksMatchingLanguageIds(frameworks, filters.languageIds),
    [frameworks, filters.languageIds],
  )

  useEffect(() => {
    if (filters.languageIds.length === 0) return
    const pruned = pruneFrameworkIdsForLanguages(filters.frameworkIds, frameworks, filters.languageIds)
    if (pruned.length === filters.frameworkIds.length) return
    onChange((current) => {
      const next = pruneFrameworkIdsForLanguages(current.frameworkIds, frameworks, current.languageIds)
      if (next.length === current.frameworkIds.length) return current
      return { ...current, frameworkIds: next }
    })
  }, [filters.languageIds, filters.frameworkIds, frameworks, onChange])

  function toggleSection(key: FilterSectionKey) {
    setOpenSections((current) => ({ ...current, [key]: !current[key] }))
  }

  function setSearch(key: FilterSectionKey, value: string) {
    setSearchBySection((current) => ({ ...current, [key]: value }))
  }

  function setLanguageIds(languageIds: number[]) {
    onChange((current) => ({
      ...current,
      languageIds,
      frameworkIds: pruneFrameworkIdsForLanguages(current.frameworkIds, frameworks, languageIds),
    }))
  }

  function toggleLanguageId(languageId: number) {
    onChange((current) => {
      const languageIds = toggleValue(current.languageIds, languageId)
      return {
        ...current,
        languageIds,
        frameworkIds: pruneFrameworkIdsForLanguages(current.frameworkIds, frameworks, languageIds),
      }
    })
  }

  function experienceLabel(experience: Experience) {
    const overrideId = experienceRoleOverrides[experience.id]
    const overrideTitle = overrideId != null ? roleTitleById.get(overrideId) : undefined
    const role = overrideTitle || experience.role
    return `${role} — ${experience.company}`
  }

  function databaseScopeLabel(scope: Database["scope"]) {
    if (scope === "sql") return t.common.sql
    if (scope === "nosql") return t.common.nosql
    return undefined
  }

  const visibleLanguages = languages.filter((item) => matchesSearch(item.name, searchBySection.languages))
  const visibleFrameworks = frameworksForLanguages.filter((item) =>
    matchesSearch(item.name, searchBySection.frameworks),
  )
  const visibleDatabases = databases.filter((item) => matchesSearch(item.name, searchBySection.databases))
  const visibleSkills = skills.filter((item) => matchesSearch(item.name, searchBySection.skills))
  const visibleExperiences = experiences.filter((item) =>
    matchesSearch(experienceLabel(item), searchBySection.experiences),
  )
  const visibleTools = tools.filter((item) => matchesSearch(item.name, searchBySection.tools))

  const toolsSelectedCount = filters.includeTools
    ? tools.length
    : filters.toolIds.length

  return (
    <div className="space-y-3">
      <h2 className="text-sm font-semibold">{t.resume.filters.title}</h2>

      {languages.length > 0 ? (
        <FilterSection
          title={t.resume.languages}
          selectedCount={filters.languageIds.length}
          open={openSections.languages}
          onToggle={() => toggleSection("languages")}
          onSelectAll={() => setLanguageIds(languages.map((item) => item.id))}
          onClear={() => setLanguageIds([])}
          search={searchBySection.languages}
          onSearchChange={(value) => setSearch("languages", value)}
          searchPlaceholder={t.resume.filters.search}
        >
          {visibleLanguages.map((language) => (
            <Chip
              key={language.id}
              label={language.name}
              selected={filters.languageIds.includes(language.id)}
              onClick={() => toggleLanguageId(language.id)}
            />
          ))}
        </FilterSection>
      ) : null}

      {frameworks.length > 0 ? (
        <FilterSection
          title={t.resume.frameworks}
          selectedCount={filters.frameworkIds.length}
          open={openSections.frameworks}
          onToggle={() => toggleSection("frameworks")}
          onSelectAll={() =>
            onChange((current) => ({
              ...current,
              frameworkIds: frameworksMatchingLanguageIds(frameworks, current.languageIds).map((item) => item.id),
            }))
          }
          onClear={() => onChange((current) => ({ ...current, frameworkIds: [] }))}
          search={searchBySection.frameworks}
          onSearchChange={(value) => setSearch("frameworks", value)}
          searchPlaceholder={t.resume.filters.search}
        >
          {visibleFrameworks.map((framework) => {
            const hint = [
              siteFrameworkScopeLabel(framework.scope ?? null, t.common),
              framework.languages.length > 0
                ? framework.languages.map((language) => language.name).join(", ")
                : undefined,
            ]
              .filter(Boolean)
              .join(" · ")

            return (
              <Chip
                key={framework.id}
                label={framework.name}
                hint={hint || undefined}
                selected={filters.frameworkIds.includes(framework.id)}
                onClick={() =>
                  onChange((current) => ({
                    ...current,
                    frameworkIds: toggleValue(current.frameworkIds, framework.id),
                  }))
                }
              />
            )
          })}
        </FilterSection>
      ) : null}

      {databases.length > 0 ? (
        <FilterSection
          title={t.resume.databases}
          selectedCount={filters.databaseIds.length}
          open={openSections.databases}
          onToggle={() => toggleSection("databases")}
          onSelectAll={() =>
            onChange((current) => ({ ...current, databaseIds: databases.map((item) => item.id) }))
          }
          onClear={() => onChange((current) => ({ ...current, databaseIds: [] }))}
          search={searchBySection.databases}
          onSearchChange={(value) => setSearch("databases", value)}
          searchPlaceholder={t.resume.filters.search}
        >
          {visibleDatabases.map((database) => (
            <Chip
              key={database.id}
              label={database.name}
              hint={databaseScopeLabel(database.scope)}
              selected={filters.databaseIds.includes(database.id)}
              onClick={() =>
                onChange((current) => ({
                  ...current,
                  databaseIds: toggleValue(current.databaseIds, database.id),
                }))
              }
            />
          ))}
        </FilterSection>
      ) : null}

      <FilterSection
        title={t.resume.toolsSection}
        selectedCount={toolsSelectedCount}
        open={openSections.tools}
        onToggle={() => toggleSection("tools")}
        onSelectAll={() =>
          onChange((current) => ({
            ...current,
            includeTools: true,
            toolIds: [],
          }))
        }
        onClear={() =>
          onChange((current) => ({
            ...current,
            includeTools: false,
            toolIds: [],
          }))
        }
        search={searchBySection.tools}
        onSearchChange={(value) => setSearch("tools", value)}
        searchPlaceholder={t.resume.filters.search}
      >
        <Chip
          label={t.resume.includeAllTools}
          selected={filters.includeTools}
          onClick={() =>
            onChange((current) => ({
              ...current,
              includeTools: !current.includeTools,
              toolIds: !current.includeTools ? [] : current.toolIds,
            }))
          }
        />
        {visibleTools.map((tool) => (
          <Chip
            key={tool.id}
            label={tool.name}
            selected={!filters.includeTools && filters.toolIds.includes(tool.id)}
            onClick={() =>
              onChange((current) => ({
                ...current,
                includeTools: false,
                toolIds: toggleValue(current.toolIds, tool.id),
              }))
            }
          />
        ))}
      </FilterSection>

      {skills.length > 0 ? (
        <FilterSection
          title={t.resume.skills}
          selectedCount={filters.skillIds.length}
          open={openSections.skills}
          onToggle={() => toggleSection("skills")}
          onSelectAll={() =>
            onChange((current) => ({ ...current, skillIds: skills.map((item) => item.id) }))
          }
          onClear={() => onChange((current) => ({ ...current, skillIds: [] }))}
          search={searchBySection.skills}
          onSearchChange={(value) => setSearch("skills", value)}
          searchPlaceholder={t.resume.filters.search}
        >
          {visibleSkills.map((skill) => (
            <Chip
              key={skill.id}
              label={skill.name}
              selected={filters.skillIds.includes(skill.id)}
              onClick={() =>
                onChange((current) => ({
                  ...current,
                  skillIds: toggleValue(current.skillIds, skill.id),
                }))
              }
            />
          ))}
        </FilterSection>
      ) : null}

      <FilterSection
        title={t.resume.experiences}
        selectedCount={filters.experienceIds.length}
        open={openSections.experiences}
        onToggle={() => toggleSection("experiences")}
        onSelectAll={() =>
          onChange((current) => ({ ...current, experienceIds: experiences.map((item) => item.id) }))
        }
        onClear={() => onChange((current) => ({ ...current, experienceIds: [] }))}
        search={searchBySection.experiences}
        onSearchChange={(value) => setSearch("experiences", value)}
        searchPlaceholder={t.resume.filters.search}
      >
        {visibleExperiences.map((experience) => (
          <Chip
            key={experience.id}
            label={experienceLabel(experience)}
            selected={filters.experienceIds.includes(experience.id)}
            onClick={() =>
              onChange((current) => ({
                ...current,
                experienceIds: toggleValue(current.experienceIds, experience.id),
              }))
            }
          />
        ))}
      </FilterSection>
    </div>
  )
}

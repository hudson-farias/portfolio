"use client"

import { useMemo, useState, type ReactNode } from "react"
import { Download } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Reveal } from "../components/reveal"
import {
  buildResumeQuery,
  countSelectedDatabases,
  countSelectedFrameworks,
  defaultResumeFilters,
  uniqueLanguagesFromFrameworks,
  type ResumeFilterState,
} from "@/lib/resume-filters"
import type { Database, Experience, Framework, LanguageRef, Skill, Tool } from "@/types"

function toggleValue<T>(values: T[], value: T) {
  return values.includes(value) ? values.filter((item) => item !== value) : [...values, value]
}

function FilterGroup({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
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

function scopeLabel(scope: Framework["scope"]) {
  if (scope === "backend") return "Backend"
  if (scope === "frontend") return "Frontend"
  return undefined
}

function databaseScopeLabel(scope: Database["scope"]) {
  if (scope === "sql") return "SQL"
  if (scope === "nosql") return "NoSQL"
  return undefined
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
  const [filters, setFilters] = useState<ResumeFilterState>(defaultResumeFilters())

  const languages = useMemo(() => uniqueLanguagesFromFrameworks(frameworks), [frameworks])

  const downloadUrl = useMemo(() => {
    const query = buildResumeQuery(filters)
    const base = `${apiBaseUrl.replace(/\/$/, "")}/landpage/resume`
    return query ? `${base}?${query}` : base
  }, [apiBaseUrl, filters])

  const selectedSkillsCount = useMemo(() => {
    if (filters.skillIds.length > 0) return filters.skillIds.length

    if (filters.sections.length === 0 || filters.sections.includes("skills")) {
      return skills.length
    }

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

  return (
    <div className="mx-auto grid w-full max-w-4xl gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <div className="space-y-4">
        {languages.length > 0 ? (
          <FilterGroup title="Linguagens">
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
          <FilterGroup title="Frameworks">
            <div className="grid max-h-56 gap-2 overflow-y-auto sm:grid-cols-2">
              {frameworks.map((framework) => {
                const hint = [
                  scopeLabel(framework.scope),
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
          <FilterGroup title="Bancos de dados">
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
          <FilterGroup title="Skills">
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

        <FilterGroup title="Experiências">
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

        <FilterGroup title="Ferramentas">
          <CheckboxRow
            label="Incluir todas as ferramentas"
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
            <h2 className="text-lg font-semibold">Prévia do filtro</h2>
            <p className="text-sm text-muted-foreground">
              Sem seleção, o PDF usa o currículo completo. Filtre por área, linguagem, framework,
              banco de dados, skill, ferramenta ou experiência antes de gerar.
            </p>
          </div>

          <dl className="space-y-2 text-sm">
            <div className="flex justify-between gap-3">
              <dt className="text-muted-foreground">Linguagens</dt>
              <dd>
                {filters.languageIds.length > 0
                  ? filters.languageIds.length
                  : filters.sections.length === 0 || filters.sections.includes("frameworks")
                    ? languages.length || "Todas"
                    : "Nenhuma"}
              </dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-muted-foreground">Frameworks</dt>
              <dd>
                {filters.frameworkIds.length > 0
                  ? filters.frameworkIds.length
                  : selectedFrameworksCount || "Nenhum"}
              </dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-muted-foreground">Bancos de dados</dt>
              <dd>
                {filters.databaseIds.length > 0
                  ? filters.databaseIds.length
                  : selectedDatabasesCount || "Nenhum"}
              </dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-muted-foreground">Skills</dt>
              <dd>{selectedSkillsCount}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-muted-foreground">Experiências</dt>
              <dd>{filters.experienceIds.length || "Todas"}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-muted-foreground">Ferramentas</dt>
              <dd>
                {filters.includeTools
                  ? "Todas"
                  : filters.toolIds.length || "Nenhuma"}
              </dd>
            </div>
          </dl>

          <Button asChild className="w-full rounded-full">
            <a href={downloadUrl} target="_blank" rel="noopener noreferrer">
              <Download className="size-4" />
              Gerar PDF
            </a>
          </Button>
        </aside>
      </Reveal>
    </div>
  )
}

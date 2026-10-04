import type { ResumeAreaSlug } from "./stack-config"

export type ResumeFilterState = {
  sections: ResumeAreaSlug[]
  skillIds: number[]
  frameworkIds: number[]
  languageIds: number[]
  databaseIds: number[]
  toolIds: number[]
  experienceIds: number[]
  includeTools: boolean
}

export const defaultResumeFilters = (): ResumeFilterState => ({
  sections: [],
  skillIds: [],
  frameworkIds: [],
  languageIds: [],
  databaseIds: [],
  toolIds: [],
  experienceIds: [],
  includeTools: false,
})

export type ExperienceRoleAssignment = {
  experience_id: number
  role_id: number
}

export function buildResumeQuery(
  filters: ResumeFilterState,
  portfolioUrl?: string | null,
  options?: {
    includeSummary?: boolean
    summary?: string | null
    experienceRoles?: ExperienceRoleAssignment[]
    headerRoleIds?: number[] | null
  },
) {
  const params = new URLSearchParams()

  if (filters.sections.length > 0) {
    params.set("sections", filters.sections.join(","))
  }

  if (filters.skillIds.length > 0) {
    params.set("skill_ids", filters.skillIds.join(","))
  }

  if (filters.frameworkIds.length > 0) {
    params.set("framework_ids", filters.frameworkIds.join(","))
  }

  if (filters.languageIds.length > 0) {
    params.set("language_ids", filters.languageIds.join(","))
  }

  if (filters.databaseIds.length > 0) {
    params.set("database_ids", filters.databaseIds.join(","))
  }

  if (filters.toolIds.length > 0) {
    params.set("tool_ids", filters.toolIds.join(","))
  }

  if (filters.experienceIds.length > 0) {
    params.set("experience_ids", filters.experienceIds.join(","))
  }

  if (filters.includeTools) {
    params.set("include_tools", "1")
  }

  if (options?.includeSummary === false) {
    params.set("include_summary", "0")
  }

  const trimmedPortfolioUrl = portfolioUrl?.trim()
  if (trimmedPortfolioUrl) {
    params.set("portfolio_url", trimmedPortfolioUrl)
  }

  const summary = options?.summary?.trim()
  if (summary) {
    params.set("summary", summary)
  }

  if (options?.experienceRoles?.length) {
    params.set(
      "experience_roles",
      options.experienceRoles.map((item) => `${item.experience_id}:${item.role_id}`).join(","),
    )
  }

  if (options?.headerRoleIds?.length) {
    params.set("header_role_ids", options.headerRoleIds.join(","))
  }

  return params.toString()
}

export function resumeDownloadPath(filters: ResumeFilterState, apiBaseUrl: string) {
  const query = buildResumeQuery(filters)
  const base = apiBaseUrl.replace(/\/$/, "")
  return query ? `${base}/landpage/resume?${query}` : `${base}/landpage/resume`
}

export function experienceRolesFromOverrides(overrides: Record<number, number>): ExperienceRoleAssignment[] {
  return Object.entries(overrides).map(([experienceId, roleId]) => ({
    experience_id: Number(experienceId),
    role_id: roleId,
  }))
}

export function overridesFromExperienceRoles(assignments: ExperienceRoleAssignment[]): Record<number, number> {
  const next: Record<number, number> = {}
  for (const item of assignments) {
    if (!Number.isFinite(item.experience_id) || !Number.isFinite(item.role_id)) continue
    next[item.experience_id] = item.role_id
  }
  return next
}

export function resumePdfBody(
  filters: ResumeFilterState,
  options?: {
    includeSummary?: boolean
    summary?: string | null
    experienceRoles?: ExperienceRoleAssignment[]
    headerRoleIds?: number[] | null
    portfolioUrl?: string | null
  },
) {
  const portfolioUrl = options?.portfolioUrl?.trim()
  return {
    sections: filters.sections,
    skill_ids: filters.skillIds,
    framework_ids: filters.frameworkIds,
    language_ids: filters.languageIds,
    database_ids: filters.databaseIds,
    tool_ids: filters.toolIds,
    experience_ids: filters.experienceIds,
    include_tools: filters.includeTools,
    include_summary: options?.includeSummary ?? true,
    summary: options?.summary?.trim() ? options.summary : undefined,
    experience_roles: options?.experienceRoles?.length ? options.experienceRoles : undefined,
    header_role_ids: options?.headerRoleIds?.length ? options.headerRoleIds : undefined,
    portfolio_url: portfolioUrl || undefined,
  }
}

export function uniqueLanguagesFromFrameworks<T extends { id: number; name: string }>(
  frameworks: { languages: T[] }[],
) {
  const map = new Map<number, T>()

  for (const framework of frameworks) {
    for (const language of framework.languages) {
      map.set(language.id, language)
    }
  }

  return [...map.values()].sort((left, right) => left.name.localeCompare(right.name))
}

/** Idiomas únicos dos frameworks visíveis no CV (seção Linguagens). */
export function languagesFromFrameworks<T extends { id: number; name: string }>(
  frameworks: { languages: T[] }[],
) {
  return uniqueLanguagesFromFrameworks(frameworks)
}

/** Seção Linguagens do CV: languageIds selecionados ∪ langs dos frameworks que entram no CV. */
export function languagesForResume<T extends { id: number; name: string }>(
  languages: T[],
  frameworks: { id: number; languages: T[] }[],
  filters: Pick<ResumeFilterState, "frameworkIds" | "languageIds" | "sections">,
) {
  const map = new Map<number, T>()

  if (filters.languageIds.length > 0) {
    const selected = new Set(filters.languageIds)
    for (const language of languages) {
      if (selected.has(language.id)) map.set(language.id, language)
    }
  }

  for (const framework of filterFrameworksForResume(frameworks, filters)) {
    for (const language of framework.languages) {
      map.set(language.id, language)
    }
  }

  return [...map.values()].sort((left, right) => left.name.localeCompare(right.name))
}

export function countSelectedFrameworks(
  frameworks: { id: number; languages: { id: number }[] }[],
  filters: Pick<ResumeFilterState, "sections" | "frameworkIds" | "languageIds">,
) {
  if (filters.frameworkIds.length > 0) return filters.frameworkIds.length

  // languageIds só filtra chips na UI; sem frameworkIds o CV não inclui frameworks.
  if (filters.languageIds.length > 0) return 0

  if (filters.sections.length === 0 || filters.sections.includes("frameworks")) {
    return frameworks.length
  }

  return 0
}

export function countSelectedDatabases(
  databases: { id: number }[],
  filters: Pick<ResumeFilterState, "sections" | "databaseIds">,
) {
  if (filters.databaseIds.length > 0) return filters.databaseIds.length

  if (filters.sections.length === 0 || filters.sections.includes("databases")) {
    return databases.length
  }

  return 0
}

/** Filtra skills para a preview: IDs explícitos têm prioridade; senão seções / tudo. */
export function filterSkillsForResume<T extends { id: number }>(skills: T[], filters: Pick<ResumeFilterState, "sections" | "skillIds">) {
  if (filters.skillIds.length > 0) {
    const skillIds = new Set(filters.skillIds)
    return skills.filter((skill) => skillIds.has(skill.id))
  }

  if (filters.sections.length === 0 || filters.sections.includes("skills")) {
    return skills
  }

  return []
}

/** Frameworks cujo `languages` intersecta `languageIds` (painel de filtros). Sem linguagens = todos. */
export function frameworksMatchingLanguageIds<T extends { id: number; languages: { id: number }[] }>(
  frameworks: T[],
  languageIds: number[],
) {
  if (languageIds.length === 0) return frameworks
  const selected = new Set(languageIds)
  return frameworks.filter((framework) =>
    framework.languages.some((language) => selected.has(language.id)),
  )
}

/** Remove `frameworkIds` que ficaram fora do filtro de linguagem. */
export function pruneFrameworkIdsForLanguages(
  frameworkIds: number[],
  frameworks: { id: number; languages: { id: number }[] }[],
  languageIds: number[],
) {
  if (languageIds.length === 0) return frameworkIds
  const allowed = new Set(frameworksMatchingLanguageIds(frameworks, languageIds).map((item) => item.id))
  return frameworkIds.filter((id) => allowed.has(id))
}

/** Espelha `framework_matches_filter`. languageIds só filtra chips na UI. */
export function filterFrameworksForResume<T extends { id: number; languages: { id: number }[] }>(
  frameworks: T[],
  filters: Pick<ResumeFilterState, "frameworkIds" | "languageIds" | "sections">,
) {
  if (filters.frameworkIds.length > 0) {
    const frameworkIds = new Set(filters.frameworkIds)
    return frameworks.filter((framework) => frameworkIds.has(framework.id))
  }

  if (filters.languageIds.length > 0) return []

  if (filters.sections.length > 0 && !filters.sections.includes("frameworks")) {
    return []
  }

  return frameworks
}

/** Espelha `database_matches_filter`. */
export function filterDatabasesForResume<T extends { id: number }>(
  databases: T[],
  filters: Pick<ResumeFilterState, "databaseIds" | "sections">,
) {
  const databaseIds = new Set(filters.databaseIds)
  const sections = new Set(filters.sections)

  return databases.filter((database) => {
    if (databaseIds.has(database.id)) return true
    if (databaseIds.size === 0) {
      if (sections.size === 0) return true
      if (sections.has("databases")) return true
    }
    return false
  })
}

/** Espelha `tool_matches_filter` + condição de seção do PDF. */
export function filterToolsForResume<T extends { id: number }>(tools: T[], filters: Pick<ResumeFilterState, "toolIds" | "includeTools">) {
  if (!filters.includeTools && filters.toolIds.length === 0) return []

  const toolIds = new Set(filters.toolIds)
  if (toolIds.size === 0) return tools

  return tools.filter((tool) => toolIds.has(tool.id))
}

/** Espelha `experience_matches_filter`. */
export function filterExperiencesForResume<T extends { id: number }>(
  experiences: T[],
  filters: Pick<ResumeFilterState, "experienceIds">,
) {
  if (filters.experienceIds.length === 0) return experiences
  const experienceIds = new Set(filters.experienceIds)
  return experiences.filter((experience) => experienceIds.has(experience.id))
}

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

export function buildResumeQuery(filters: ResumeFilterState) {
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

  return params.toString()
}

export function resumeDownloadPath(filters: ResumeFilterState, apiBaseUrl: string) {
  const query = buildResumeQuery(filters)
  const base = apiBaseUrl.replace(/\/$/, "")
  return query ? `${base}/landpage/resume?${query}` : `${base}/landpage/resume`
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

export function countSelectedFrameworks(
  frameworks: { id: number; languages: { id: number }[] }[],
  filters: Pick<ResumeFilterState, "sections" | "frameworkIds" | "languageIds">,
) {
  if (filters.frameworkIds.length > 0) return filters.frameworkIds.length

  if (filters.languageIds.length > 0) {
    return frameworks.filter((framework) =>
      framework.languages.some((language) => filters.languageIds.includes(language.id)),
    ).length
  }

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

"use client"

import { useState } from "react"
import { Loader2 } from "lucide-react"

import { API } from "@/api/client"
import { Button } from "@/components/ui/button"
import { useSiteLocale } from "@/i18n/site-locale-provider"
import {
  overridesFromExperienceRoles,
  type ExperienceRoleAssignment,
  type ResumeFilterState,
} from "@/lib/resume-filters"

type JobMatchFilters = {
  skill_ids: number[]
  framework_ids: number[]
  language_ids: number[]
  database_ids: number[]
  tool_ids: number[]
  experience_ids: number[]
  include_tools: boolean
}

type JobMatchResponse = {
  filters: JobMatchFilters
  missing_skills: { name: string }[]
  experience_roles?: ExperienceRoleAssignment[]
  role_ids?: number[]
  match_percent?: number | null
  rationale: string
}

export type AiSuggestFlags = {
  summary: boolean
  headerRoles: boolean
  experienceRoles: boolean
  filters: boolean
  missingSkills: boolean
}

function filtersFromMatch(payload: JobMatchFilters): ResumeFilterState {
  return {
    sections: [],
    skillIds: payload.skill_ids ?? [],
    frameworkIds: payload.framework_ids ?? [],
    languageIds: payload.language_ids ?? [],
    databaseIds: payload.database_ids ?? [],
    toolIds: payload.tool_ids ?? [],
    experienceIds: payload.experience_ids ?? [],
    includeTools: Boolean(payload.include_tools),
  }
}

function normalizeMatchPercent(value: unknown) {
  if (value == null || value === "") return null
  const parsed = Math.round(Number(value))
  if (!Number.isFinite(parsed)) return null
  return Math.min(100, Math.max(0, parsed))
}

export function ResumeJobMatch({
  instructions,
  suggest,
  onApplyFilters,
  onApplyExperienceRoles,
  onApplyHeaderRoles,
  onMissingSkills,
  onMatchPercent,
  onMatchRationale,
  onRegenerateSummary,
}: {
  instructions: string
  suggest: AiSuggestFlags
  onApplyFilters: (filters: ResumeFilterState) => void
  onApplyExperienceRoles: (overrides: Record<number, number>) => void
  onApplyHeaderRoles: (roleIds: number[]) => void
  onMissingSkills: (skills: { name: string }[]) => void
  onMatchPercent: (percent: number | null) => void
  onMatchRationale: (rationale: string | null) => void
  onRegenerateSummary: (filters?: ResumeFilterState) => Promise<void>
}) {
  const { t } = useSiteLocale()
  const [url, setUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function analyze() {
    const trimmed = url.trim()
    if (!trimmed) {
      setError(t.resume.ai.urlRequired)
      return
    }

    setLoading(true)
    setError(null)
    onMatchPercent(null)
    onMatchRationale(null)

    try {
      const response = await API.post("/landpage/resume/job-match", {
        url: trimmed,
        instructions: instructions.trim(),
        suggest_summary: suggest.summary,
        suggest_header_roles: suggest.headerRoles,
        suggest_experience_roles: suggest.experienceRoles,
        suggest_filters: suggest.filters,
        suggest_missing_skills: suggest.missingSkills,
      })
      if (!response.ok) {
        setError(t.resume.ai.analyzeError)
        return
      }

      const data: JobMatchResponse = await response.json()
      const matchedFilters = filtersFromMatch(data.filters)

      if (suggest.filters) {
        onApplyFilters(matchedFilters)
      }

      if (suggest.experienceRoles) {
        const experienceRoles = data.experience_roles ?? []
        if (experienceRoles.length > 0) {
          onApplyExperienceRoles(overridesFromExperienceRoles(experienceRoles))
        }
      }

      if (suggest.headerRoles) {
        const headerRoleIds = (data.role_ids ?? []).filter((id) => Number.isFinite(id))
        if (headerRoleIds.length > 0) {
          onApplyHeaderRoles(headerRoleIds)
        }
      }

      if (suggest.missingSkills) {
        onMissingSkills(data.missing_skills ?? [])
      } else {
        onMissingSkills([])
      }

      onMatchPercent(normalizeMatchPercent(data.match_percent))
      onMatchRationale((data.rationale || "").trim() || null)

      if (suggest.summary) {
        await onRegenerateSummary(suggest.filters ? matchedFilters : undefined)
      }
    } catch {
      setError(t.resume.ai.analyzeError)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <h3 className="text-sm font-semibold">{t.resume.ai.title}</h3>
        <p className="text-xs text-muted-foreground">{t.resume.ai.description}</p>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          type="url"
          value={url}
          onChange={(event) => setUrl(event.target.value)}
          placeholder={t.resume.ai.urlPlaceholder}
          className="min-w-0 flex-1 rounded-xl border border-border/60 bg-background px-3 py-2 text-sm outline-none ring-primary/40 focus:ring-2"
          disabled={loading}
        />
        <Button type="button" className="rounded-full sm:shrink-0" onClick={analyze} disabled={loading}>
          {loading ? <Loader2 className="size-4 animate-spin" /> : null}
          {loading ? t.resume.ai.analyzing : t.resume.ai.analyze}
        </Button>
      </div>

      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  )
}

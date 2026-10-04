"use client"

import { useEffect, useMemo, useState } from "react"
import { Download, Info, Loader2, RefreshCw, Sparkles } from "lucide-react"

import { API } from "@/api/client"
import { Button } from "@/components/ui/button"
import { Reveal } from "@/app/(home)/[segment]/_ui/reveal"
import { useSiteLocale } from "@/i18n/site-locale-provider"
import {
  buildResumeQuery,
  defaultResumeFilters,
  experienceRolesFromOverrides,
  uniqueLanguagesFromFrameworks,
  type ResumeFilterState,
} from "@/lib/resume-filters"
import type { Database, Experience, Framework, ResumeRole, Skill, Tool } from "@/types"

import {
  ResumeAiSuggestionsModal,
  type PendingSuggestionItem,
} from "./resume-ai-suggestions-modal"
import { ResumeFiltersPanel } from "./resume-filters-panel"
import { ResumeJobMatch, type AiSuggestFlags } from "./resume-job-match"
import { ResumePreview, type ResumePreviewProfile } from "./resume-preview"

const DEFAULT_SKILL_ICON = "code"

function SuggestCheckbox({
  label,
  checked,
  onChange,
}: {
  label: string
  checked: boolean
  onChange: () => void
}) {
  return (
    <label className="flex cursor-pointer items-start gap-2 text-sm text-muted-foreground">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="mt-0.5 size-4 shrink-0 rounded border-border accent-primary"
      />
      <span>{label}</span>
    </label>
  )
}

export function ResumeBuilder({
  skills: initialSkills,
  frameworks,
  databases,
  tools,
  experiences: initialExperiences,
  roles,
  profile,
  canMutate,
  apiBaseUrl,
}: {
  skills: Skill[]
  frameworks: Framework[]
  databases: Database[]
  tools: Tool[]
  experiences: Experience[]
  roles: ResumeRole[]
  profile: ResumePreviewProfile
  canMutate: boolean
  apiBaseUrl: string
}) {
  const { t, locale } = useSiteLocale()
  const [filters, setFilters] = useState<ResumeFilterState>(defaultResumeFilters())
  const [skills, setSkills] = useState(initialSkills)
  const [experiences] = useState(initialExperiences)
  const [instructions, setInstructions] = useState("")
  const [experienceRoleOverrides, setExperienceRoleOverrides] = useState<Record<number, number>>({})
  const [headerRoleIds, setHeaderRoleIds] = useState<number[] | null>(null)
  const [includeSummary, setIncludeSummary] = useState(true)
  const [suggestHeaderRoles, setSuggestHeaderRoles] = useState(true)
  const [suggestExperienceRoles, setSuggestExperienceRoles] = useState(true)
  const [suggestFilters, setSuggestFilters] = useState(true)
  const [suggestMissingSkills, setSuggestMissingSkills] = useState(true)
  const [summaryOverride, setSummaryOverride] = useState<string | null>(null)
  const [pendingSummarySave, setPendingSummarySave] = useState(false)
  const [pendingExperienceSaves, setPendingExperienceSaves] = useState<number[]>([])
  const [pendingHeaderSaves, setPendingHeaderSaves] = useState<number[]>([])
  const [missingSkills, setMissingSkills] = useState<{ name: string }[]>([])
  const [filtersFromAi, setFiltersFromAi] = useState(false)
  const [matchPercent, setMatchPercent] = useState<number | null>(null)
  const [matchRationale, setMatchRationale] = useState<string | null>(null)
  const [suggestionsOpen, setSuggestionsOpen] = useState(false)
  const [addingName, setAddingName] = useState<string | null>(null)
  const [regeneratingSummary, setRegeneratingSummary] = useState(false)
  const [savingKey, setSavingKey] = useState<string | null>(null)
  const [summaryError, setSummaryError] = useState<string | null>(null)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [saveMessage, setSaveMessage] = useState<string | null>(null)
  const [portfolioUrl, setPortfolioUrl] = useState<string | null>(null)

  useEffect(() => {
    setPortfolioUrl(window.location.origin)
  }, [])

  const suggestFlags: AiSuggestFlags = {
    summary: includeSummary,
    headerRoles: suggestHeaderRoles,
    experienceRoles: suggestExperienceRoles,
    filters: suggestFilters,
    missingSkills: suggestMissingSkills,
  }

  const languages = useMemo(() => uniqueLanguagesFromFrameworks(frameworks), [frameworks])
  const experienceRoles = useMemo(
    () => experienceRolesFromOverrides(experienceRoleOverrides),
    [experienceRoleOverrides],
  )
  const roleTitleById = useMemo(() => {
    const map = new Map<number, string>()
    for (const role of roles) map.set(role.id, role.title)
    return map
  }, [roles])
  const experienceById = useMemo(() => {
    const map = new Map<number, Experience>()
    for (const experience of experiences) map.set(experience.id, experience)
    return map
  }, [experiences])

  const downloadUrl = useMemo(() => {
    const query = buildResumeQuery(filters, portfolioUrl, {
      includeSummary: canMutate ? includeSummary : true,
      summary: canMutate ? summaryOverride : null,
      experienceRoles: canMutate ? experienceRoles : [],
      headerRoleIds: canMutate ? headerRoleIds : null,
    })
    const base = `${apiBaseUrl.replace(/\/$/, "")}/landpage/resume`
    return query ? `${base}?${query}` : base
  }, [
    apiBaseUrl,
    canMutate,
    experienceRoles,
    filters,
    headerRoleIds,
    includeSummary,
    portfolioUrl,
    summaryOverride,
  ])

  function handleSkillCreated(skill: Skill) {
    setSkills((current) => {
      if (current.some((item) => item.id === skill.id)) return current
      return [...current, skill].sort((left, right) => left.name.localeCompare(right.name))
    })
    setFilters((current) => ({
      ...current,
      skillIds: current.skillIds.includes(skill.id) ? current.skillIds : [...current.skillIds, skill.id],
    }))
  }

  function applyFiltersFromAi(next: ResumeFilterState) {
    setFilters(next)
    setFiltersFromAi(true)
    setSaveMessage(null)
    setSaveError(null)
  }

  function applyExperienceRoles(overrides: Record<number, number>) {
    setExperienceRoleOverrides(overrides)
    setPendingExperienceSaves(Object.keys(overrides).map(Number))
    setSaveMessage(null)
    setSaveError(null)
  }

  function applyHeaderRoles(roleIds: number[]) {
    setHeaderRoleIds(roleIds)
    setPendingHeaderSaves(roleIds)
    setSaveMessage(null)
    setSaveError(null)
  }

  async function addMissingSkill(name: string) {
    if (!canMutate || addingName || savingKey) return

    setAddingName(name)
    setSaveError(null)
    setSaveMessage(null)

    try {
      const response = await API.post("/landpage/resume/skills", {
        name,
        icon: DEFAULT_SKILL_ICON,
      })
      if (!response.ok) {
        setSaveError(t.resume.ai.addSkillError)
        return
      }

      const skill: { id: number; name: string; icon: string } = await response.json()
      handleSkillCreated({ id: skill.id, name: skill.name, icon: skill.icon })
      setMissingSkills((current) => current.filter((item) => item.name !== name))
      setSaveMessage(t.resume.ai.addSkillSuccess)
    } catch {
      setSaveError(t.resume.ai.addSkillError)
    } finally {
      setAddingName(null)
    }
  }

  const pendingSuggestionItems = useMemo(() => {
    const items: PendingSuggestionItem[] = []

    if (pendingSummarySave && summaryOverride?.trim()) {
      items.push({
        kind: "summary",
        key: "summary",
        category: t.resume.doc.summary,
        detail: summaryOverride.trim(),
      })
    }

    for (const roleId of pendingHeaderSaves) {
      items.push({
        kind: "header_role",
        key: `header-${roleId}`,
        roleId,
        category: t.resume.ai.headerTitles,
        detail: roleTitleById.get(roleId) || `#${roleId}`,
      })
    }

    for (const experienceId of pendingExperienceSaves) {
      const experience = experienceById.get(experienceId)
      const roleId = experienceRoleOverrides[experienceId]
      const roleTitle = roleId != null ? roleTitleById.get(roleId) : undefined
      items.push({
        kind: "experience_role",
        key: `exp-${experienceId}`,
        experienceId,
        category: t.resume.ai.experienceRoles,
        detail: experience
          ? `${experience.company} → ${roleTitle || experience.role}`
          : `#${experienceId}`,
      })
    }

    for (const skill of missingSkills) {
      items.push({
        kind: "missing_skill",
        key: `skill-${skill.name}`,
        name: skill.name,
        category: t.resume.ai.missingSkills,
        detail: skill.name,
      })
    }

    if (filtersFromAi) {
      const parts = [
        `${t.resume.skills}: ${filters.skillIds.length || t.resume.all}`,
        `${t.resume.frameworks}: ${filters.frameworkIds.length || t.resume.all}`,
        `${t.resume.databases}: ${filters.databaseIds.length || t.resume.all}`,
        `${t.resume.experiences}: ${filters.experienceIds.length || t.resume.all}`,
      ]
      items.push({
        kind: "filters",
        key: "filters",
        category: t.resume.filters.title,
        detail: parts.join(" · "),
      })
    }

    return items
  }, [
    pendingSummarySave,
    summaryOverride,
    pendingHeaderSaves,
    pendingExperienceSaves,
    experienceRoleOverrides,
    missingSkills,
    filtersFromAi,
    filters,
    roleTitleById,
    experienceById,
    t,
  ])

  const pendingSuggestionsCount = useMemo(
    () => pendingSuggestionItems.filter((item) => item.kind !== "filters").length,
    [pendingSuggestionItems],
  )

  async function regenerateSummary(filtersOverride?: ResumeFilterState) {
    setRegeneratingSummary(true)
    setSummaryError(null)

    const activeFilters = filtersOverride ?? filters

    try {
      const response = await API.post("/landpage/resume/summary", {
        locale,
        skill_ids: activeFilters.skillIds,
        framework_ids: activeFilters.frameworkIds,
        language_ids: activeFilters.languageIds,
        database_ids: activeFilters.databaseIds,
        tool_ids: activeFilters.toolIds,
        experience_ids: activeFilters.experienceIds,
        include_tools: activeFilters.includeTools,
        instructions: instructions.trim(),
      })
      if (!response.ok) {
        let detail = t.resume.regenerateSummaryError
        try {
          const body = await response.json()
          if (typeof body?.detail === "string" && body.detail.trim()) {
            detail = body.detail.trim()
          }
        } catch {
          /* keep fallback */
        }
        setSummaryError(detail)
        return
      }

      const data: { summary?: string } = await response.json()
      const summary = (data.summary || "").trim()
      if (!summary) {
        setSummaryError(t.resume.regenerateSummaryError)
        return
      }

      setSummaryOverride(summary)
      setIncludeSummary(true)
      setPendingSummarySave(true)
      setSaveMessage(null)
      setSaveError(null)
    } catch {
      setSummaryError(t.resume.regenerateSummaryError)
    } finally {
      setRegeneratingSummary(false)
    }
  }

  async function saveSummary() {
    if (!canMutate || !summaryOverride?.trim() || savingKey) return

    setSavingKey("summary")
    setSaveError(null)
    setSaveMessage(null)

    try {
      const response = await API.post("/landpage/resume/save", {
        type: "summary",
        locale,
        summary: summaryOverride.trim(),
      })
      if (!response.ok) {
        setSaveError(t.resume.ai.saveError)
        return
      }

      setPendingSummarySave(false)
      setSaveMessage(t.resume.ai.saveSummarySuccess)
    } catch {
      setSaveError(t.resume.ai.saveError)
    } finally {
      setSavingKey(null)
    }
  }

  async function saveExperienceRole(experienceId: number) {
    const roleId = experienceRoleOverrides[experienceId]
    if (!canMutate || roleId == null || savingKey) return

    setSavingKey(`exp-${experienceId}`)
    setSaveError(null)
    setSaveMessage(null)

    try {
      const response = await API.post("/landpage/resume/save", {
        type: "experience_role",
        locale,
        experience_id: experienceId,
        role_id: roleId,
      })
      if (!response.ok) {
        setSaveError(t.resume.ai.saveError)
        return
      }

      setPendingExperienceSaves((current) => current.filter((id) => id !== experienceId))
      setSaveMessage(t.resume.ai.saveExperienceRoleSuccess)
    } catch {
      setSaveError(t.resume.ai.saveError)
    } finally {
      setSavingKey(null)
    }
  }

  async function saveHeaderRole(roleId: number) {
    if (!canMutate || savingKey) return

    setSavingKey(`header-${roleId}`)
    setSaveError(null)
    setSaveMessage(null)

    try {
      const response = await API.post("/landpage/resume/save", {
        type: "header_roles",
        locale,
        role_ids: [roleId],
      })
      if (!response.ok) {
        setSaveError(t.resume.ai.saveError)
        return
      }

      setPendingHeaderSaves((current) => current.filter((id) => id !== roleId))
      setSaveMessage(t.resume.ai.saveHeaderRoleSuccess)
    } catch {
      setSaveError(t.resume.ai.saveError)
    } finally {
      setSavingKey(null)
    }
  }

  return (
    <div className="mx-auto grid w-full max-w-6xl gap-6 lg:grid-cols-2">
      <div className="space-y-4">
        {canMutate ? (
          <section className="space-y-4 rounded-2xl border border-border/50 bg-card/40 p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="flex items-center gap-2 text-sm font-semibold">
                <Sparkles className="size-4 text-primary" />
                {t.resume.ai.toolsTitle}
                {matchPercent != null ? (
                  <span className="inline-flex items-center gap-1">
                    <span
                      className={
                        matchPercent >= 75
                          ? "rounded-full bg-emerald-500/15 px-2 py-0.5 text-xs font-medium text-emerald-600 dark:text-emerald-400"
                          : matchPercent >= 50
                            ? "rounded-full bg-amber-500/15 px-2 py-0.5 text-xs font-medium text-amber-700 dark:text-amber-400"
                            : "rounded-full bg-destructive/15 px-2 py-0.5 text-xs font-medium text-destructive"
                      }
                    >
                      {t.resume.ai.matchBadge.replace("{percent}", String(matchPercent))}
                    </span>
                    {matchRationale ? (
                      <span className="group relative inline-flex">
                        <button
                          type="button"
                          className="inline-flex rounded-full text-muted-foreground outline-none ring-primary/40 hover:text-foreground focus-visible:ring-2"
                          aria-label={t.resume.ai.matchBadgeHint}
                        >
                          <Info className="size-3.5" />
                        </button>
                        <span
                          role="tooltip"
                          className="pointer-events-none absolute left-1/2 top-full z-20 mt-1.5 w-56 -translate-x-1/2 rounded-lg border border-border/60 bg-popover px-2.5 py-2 text-left text-xs font-normal leading-relaxed text-popover-foreground opacity-0 shadow-md transition-opacity group-hover:opacity-100 group-focus-within:opacity-100 sm:w-64"
                        >
                          {matchRationale}
                        </span>
                      </span>
                    ) : null}
                  </span>
                ) : null}
              </h2>
              <Button
                type="button"
                variant="outline"
                className="rounded-full"
                onClick={() => setSuggestionsOpen(true)}
              >
                {t.resume.ai.suggestionsButton}
                {pendingSuggestionsCount > 0 ? (
                  <span className="rounded-full bg-primary/15 px-1.5 text-xs text-primary">
                    {pendingSuggestionsCount}
                  </span>
                ) : null}
              </Button>
            </div>

            <div className="space-y-2">
              <label className="block space-y-1.5">
                <span className="text-sm font-semibold">{t.resume.ai.instructions}</span>
                <textarea
                  value={instructions}
                  onChange={(event) => setInstructions(event.target.value)}
                  placeholder={t.resume.ai.instructionsPlaceholder}
                  rows={3}
                  className="w-full resize-y rounded-xl border border-border/60 bg-background px-3 py-2 text-sm outline-none ring-primary/40 focus:ring-2"
                />
              </label>
              <p className="text-xs text-muted-foreground">{t.resume.ai.instructionsHint}</p>
            </div>

            <div className="border-t border-border/40 pt-4">
              <ResumeJobMatch
                instructions={instructions}
                suggest={suggestFlags}
                onApplyFilters={applyFiltersFromAi}
                onApplyExperienceRoles={applyExperienceRoles}
                onApplyHeaderRoles={applyHeaderRoles}
                onMissingSkills={setMissingSkills}
                onMatchPercent={setMatchPercent}
                onMatchRationale={setMatchRationale}
                onRegenerateSummary={regenerateSummary}
              />
            </div>

            <div className="space-y-2 border-t border-border/40 pt-4">
              <p className="text-xs text-muted-foreground">{t.resume.ai.suggestTopicsHint}</p>
              <div className="grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-3">
                <SuggestCheckbox
                  label={t.resume.doc.summary}
                  checked={includeSummary}
                  onChange={() => setIncludeSummary((current) => !current)}
                />
                <SuggestCheckbox
                  label={t.resume.ai.suggestHeaderRoles}
                  checked={suggestHeaderRoles}
                  onChange={() => setSuggestHeaderRoles((current) => !current)}
                />
                <SuggestCheckbox
                  label={t.resume.ai.suggestExperienceRoles}
                  checked={suggestExperienceRoles}
                  onChange={() => setSuggestExperienceRoles((current) => !current)}
                />
                <SuggestCheckbox
                  label={t.resume.ai.suggestFilters}
                  checked={suggestFilters}
                  onChange={() => setSuggestFilters((current) => !current)}
                />
                <SuggestCheckbox
                  label={t.resume.ai.suggestMissingSkills}
                  checked={suggestMissingSkills}
                  onChange={() => setSuggestMissingSkills((current) => !current)}
                />
              </div>
            </div>

            <div className="space-y-3 border-t border-border/40 pt-4">
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-full"
                  onClick={() => regenerateSummary()}
                  disabled={regeneratingSummary}
                >
                  {regeneratingSummary ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <RefreshCw className="size-4" />
                  )}
                  {regeneratingSummary ? t.resume.regeneratingSummary : t.resume.regenerateSummary}
                </Button>
              </div>
              {summaryError ? <p className="text-xs text-destructive">{summaryError}</p> : null}
            </div>

            {saveError ? <p className="text-xs text-destructive">{saveError}</p> : null}
            {saveMessage ? <p className="text-xs text-muted-foreground">{saveMessage}</p> : null}

            <ResumeAiSuggestionsModal
              open={suggestionsOpen}
              onOpenChange={setSuggestionsOpen}
              items={pendingSuggestionItems}
              savingKey={savingKey}
              addingName={addingName}
              onSaveSummary={saveSummary}
              onSaveHeaderRole={saveHeaderRole}
              onSaveExperienceRole={saveExperienceRole}
              onAddMissingSkill={addMissingSkill}
            />
          </section>
        ) : null}

        <ResumeFiltersPanel
          filters={filters}
          onChange={setFilters}
          languages={languages}
          frameworks={frameworks}
          databases={databases}
          skills={skills}
          experiences={experiences}
          tools={tools}
          roles={roles}
          experienceRoleOverrides={experienceRoleOverrides}
        />
      </div>

      <aside className="space-y-4 self-start lg:sticky lg:top-28">
        <Reveal variant="scale">
          <div className="max-h-[min(80vh,1100px)] overflow-auto rounded-sm">
            <ResumePreview
              profile={profile}
              skills={skills}
              frameworks={frameworks}
              languages={languages}
              databases={databases}
              tools={tools}
              experiences={experiences}
              roles={roles}
              experienceRoleOverrides={experienceRoleOverrides}
              headerRoleIds={canMutate ? headerRoleIds : null}
              filters={filters}
              includeSummary={canMutate ? includeSummary : true}
              summaryOverride={canMutate ? summaryOverride : null}
              portfolioUrl={portfolioUrl}
            />
          </div>
        </Reveal>

        <Button asChild className="rounded-full">
          <a href={downloadUrl} target="_blank" rel="noopener noreferrer">
            <Download className="size-4" />
            {t.resume.generatePdf}
          </a>
        </Button>
      </aside>
    </div>
  )
}

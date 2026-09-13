import type { Dictionary } from "@/i18n/dictionary"

export const FRAMEWORK_SCOPES = ["backend", "frontend", "fullstack", "mobile", "automation", "other"] as const

export type FrameworkScopeValue = (typeof FRAMEWORK_SCOPES)[number]

export type FrameworkScope = FrameworkScopeValue | "" | null

export const ADMIN_FRAMEWORK_SCOPE_OPTIONS: { value: FrameworkScopeValue; label: string }[] = [
  { value: "backend", label: "Backend" },
  { value: "frontend", label: "Frontend" },
  { value: "fullstack", label: "Full stack" },
  { value: "mobile", label: "Mobile" },
  { value: "automation", label: "Automação" },
  { value: "other", label: "Outros" },
]

export function adminFrameworkScopeLabel(scope: FrameworkScope) {
  if (!scope) return "—"
  return ADMIN_FRAMEWORK_SCOPE_OPTIONS.find((option) => option.value === scope)?.label ?? scope
}

export function siteFrameworkScopeLabel(scope: FrameworkScope, t: Dictionary["common"]) {
  if (!scope) return null

  const labels: Record<FrameworkScopeValue, string> = {
    backend: t.backend,
    frontend: t.frontend,
    fullstack: t.fullstack,
    mobile: t.mobile,
    automation: t.automation,
    other: t.other,
  }

  return labels[scope] ?? null
}

export function frameworkStackTechEmpty(scope: FrameworkScopeValue, t: Dictionary["stackTech"]) {
  const labels: Record<FrameworkScopeValue, string> = {
    backend: t.emptyBackend,
    frontend: t.emptyFrontend,
    fullstack: t.emptyFullstack,
    mobile: t.emptyMobile,
    automation: t.emptyAutomation,
    other: t.emptyOther,
  }

  return labels[scope]
}

export function frameworkScopeEmpty(scope: FrameworkScopeValue, t: Dictionary["frameworks"]) {
  const labels: Record<FrameworkScopeValue, string> = {
    backend: t.emptyBackend,
    frontend: t.emptyFrontend,
    fullstack: t.emptyFullstack,
    mobile: t.emptyMobile,
    automation: t.emptyAutomation,
    other: t.emptyOther,
  }

  return labels[scope]
}

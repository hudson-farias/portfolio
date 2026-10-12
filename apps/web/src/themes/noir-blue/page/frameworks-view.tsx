"use client"

import { useMemo, useState } from "react"

import { AppIcon } from "@/components/icons/app-icon"
import {
  FRAMEWORK_SCOPES,
  frameworkScopeEmpty,
  siteFrameworkScopeLabel,
  type FrameworkScopeValue,
} from "@/lib/framework-scope"
import { cn } from "@/lib/utils"
import type { Dictionary } from "@/i18n/dictionary"
import type { Framework } from "@/themes/types"

import { Reveal } from "../reveal"

function SegmentedSwitch<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T
  options: { value: T; label: string; count: number }[]
  onChange: (value: T) => void
}) {
  if (options.length === 0) return null

  return (
    <div className="inline-flex flex-wrap gap-1.5 rounded-md border border-border/60 bg-card p-1.5">
      {options.map((option) => {
        const active = value === option.value
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={cn(
              "inline-flex cursor-pointer items-center gap-2 rounded px-3.5 py-1.5 text-xs font-medium transition-colors",
              active
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:bg-muted/40 hover:text-foreground",
            )}
          >
            <span>{option.label}</span>
            <span
              className={cn(
                "font-mono text-[10px]",
                active ? "rounded bg-primary-foreground/15 px-1.5 py-0.5" : "text-muted-foreground/80",
              )}
            >
              {option.count}
            </span>
          </button>
        )
      })}
    </div>
  )
}

function FrameworkTile({
  framework,
  common,
}: {
  framework: Framework
  common: Dictionary["common"]
}) {
  const scopeLabel = siteFrameworkScopeLabel(framework.scope ?? null, common)
  const languageHint = framework.languages.map((language) => language.name).join(" · ")
  const title = [framework.name, scopeLabel, languageHint].filter(Boolean).join(" — ")

  return (
    <article
      title={title}
      className="noir-tile group flex min-h-[160px] flex-col justify-between rounded-lg border border-border/60 bg-card p-5 transition-colors hover:border-primary/70"
    >
      <div>
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-md border border-border/60 bg-muted/30 text-muted-foreground transition-colors group-hover:text-foreground">
            <AppIcon name={framework.icon} className="size-5" />
          </div>
          {scopeLabel ? (
            <span className="rounded border border-border/60 bg-muted/20 px-2 py-0.5 font-mono text-[11px] text-muted-foreground">
              {scopeLabel}
            </span>
          ) : null}
        </div>
        <h3 className="font-heading text-base font-semibold tracking-tight text-foreground transition-colors group-hover:text-primary">
          {framework.name}
        </h3>
        {languageHint ? (
          <p className="mt-1 font-mono text-xs text-muted-foreground">{languageHint}</p>
        ) : null}
      </div>

      {framework.languages.length > 0 ? (
        <div className="mt-4 flex flex-wrap items-center gap-1.5 border-t border-border/40 pt-4">
          {framework.languages.map((language) => (
            <span
              key={language.id}
              className="inline-flex items-center gap-1 rounded border border-border/50 bg-muted/15 px-2 py-0.5 text-[11px] text-muted-foreground"
            >
              <AppIcon name={language.icon} className="size-3" />
              {language.name}
            </span>
          ))}
        </div>
      ) : null}
    </article>
  )
}

export function FrameworksView({
  frameworks,
  copy,
  common,
}: {
  frameworks: Framework[]
  copy: Dictionary["frameworks"]
  common: Dictionary["common"]
}) {
  const availableScopes = useMemo(
    () => FRAMEWORK_SCOPES.filter((scope) => frameworks.some((framework) => framework.scope === scope)),
    [frameworks],
  )
  const [scope, setScope] = useState<FrameworkScopeValue>(availableScopes[0] ?? "backend")

  const effectiveScope = useMemo(() => {
    if (availableScopes.includes(scope)) return scope
    return availableScopes[0] ?? scope
  }, [scope, availableScopes])

  const items = useMemo(
    () => frameworks.filter((framework) => framework.scope === effectiveScope),
    [frameworks, effectiveScope],
  )

  const scopeOptions = availableScopes.map((value) => ({
    value,
    label: siteFrameworkScopeLabel(value, common) ?? value,
    count: frameworks.filter((framework) => framework.scope === value).length,
  }))

  const activeScopeLabel = siteFrameworkScopeLabel(effectiveScope, common) ?? effectiveScope

  if (frameworks.length === 0 || availableScopes.length === 0) {
    return <p className="text-center text-muted-foreground">{copy.empty}</p>
  }

  const emptyLabel = frameworkScopeEmpty(effectiveScope, copy)

  return (
    <div className="space-y-8">
      <Reveal className="flex flex-col justify-between gap-4 border-b border-border/40 pb-8 sm:flex-row sm:items-center">
        <SegmentedSwitch value={effectiveScope} onChange={setScope} options={scopeOptions} />
        <div className="flex items-center gap-2 self-start font-mono text-xs text-muted-foreground sm:self-auto">
          <span aria-hidden className="inline-block size-2 rounded-full bg-emerald-500/80" />
          <span>
            {activeScopeLabel}: {items.length}
          </span>
        </div>
      </Reveal>

      {items.length > 0 ? (
        <Reveal delay={80}>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {items.map((framework, index) => (
              <Reveal key={framework.id} variant="scale" delay={80 + index * 50}>
                <FrameworkTile framework={framework} common={common} />
              </Reveal>
            ))}
          </div>
        </Reveal>
      ) : (
        <Reveal delay={80}>
          <p className="text-sm text-muted-foreground">{emptyLabel}</p>
        </Reveal>
      )}
    </div>
  )
}

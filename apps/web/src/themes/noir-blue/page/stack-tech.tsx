"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { AppIcon } from "@/components/icons/app-icon"
import {
  FRAMEWORK_SCOPES,
  frameworkStackTechEmpty,
  siteFrameworkScopeLabel,
  type FrameworkScopeValue,
} from "@/lib/framework-scope"
import { cn } from "@/lib/utils"
import type { Dictionary } from "@/i18n/dictionary"
import type { Framework, StackCopy } from "@/themes/types"

import { Reveal } from "../reveal"
import { SectionEyebrow, SectionLead, SectionTitle } from "../section-heading"

const tileClassName =
  "flex min-h-[120px] w-full flex-col rounded-lg border border-border/60 bg-card p-5 transition-colors hover:border-primary md:p-6"

function SegmentedSwitch<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T
  options: { value: T; label: string }[]
  onChange: (value: T) => void
}) {
  if (options.length === 0) return null

  return (
    <div className="inline-flex flex-wrap gap-1 rounded-lg border border-border/60 bg-card p-1">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={cn(
            "cursor-pointer rounded-md px-4 py-1.5 text-sm font-medium transition-colors",
            value === option.value
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {option.label}
        </button>
      ))}
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
  const languageHint = framework.languages.map((language) => language.name).join(" · ")
  const scope = siteFrameworkScopeLabel(framework.scope ?? null, common)
  const title = [framework.name, scope, languageHint].filter(Boolean).join(" — ")

  return (
    <article className={tileClassName} title={title}>
      <AppIcon name={framework.icon} className="mb-3 size-7" />
      <h4 className="font-heading text-base font-semibold tracking-tight">{framework.name}</h4>
      {languageHint || scope ? (
        <span className="mt-1 text-xs text-muted-foreground">
          {[scope, languageHint].filter(Boolean).join(" / ")}
        </span>
      ) : null}
    </article>
  )
}

export function StackTech({
  frameworks,
  copy,
  common,
  frameworksHref,
  limit = 8,
}: {
  frameworks: Framework[]
  copy: StackCopy
  common: Dictionary["common"]
  frameworksHref: string
  limit?: number
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

  const visibleItems = items.slice(0, limit)
  const hasMore = items.length > limit

  const scopeOptions = availableScopes.map((value) => ({
    value,
    label: siteFrameworkScopeLabel(value, common) ?? value,
  }))

  if (frameworks.length === 0 || availableScopes.length === 0) return null

  const emptyLabel = frameworkStackTechEmpty(effectiveScope, copy)

  return (
    <section id="stack-tech" className="scroll-mt-28 border-t border-border/30 pt-16 md:pt-24">
      <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <Reveal>
          <SectionEyebrow>04 / {copy.title}</SectionEyebrow>
          <SectionTitle>{copy.title}</SectionTitle>
          <SectionLead className="mt-2 max-w-xl">{copy.description}</SectionLead>
        </Reveal>

        <Reveal delay={80}>
          <SegmentedSwitch value={effectiveScope} onChange={setScope} options={scopeOptions} />
        </Reveal>
      </div>

      {visibleItems.length > 0 ? (
        <Reveal delay={120}>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {visibleItems.map((framework, index) => (
              <Reveal key={framework.id} variant="scale" delay={80 + index * 50}>
                <FrameworkTile framework={framework} common={common} />
              </Reveal>
            ))}
          </div>
        </Reveal>
      ) : (
        <Reveal delay={120}>
          <p className="text-sm text-muted-foreground">{emptyLabel}</p>
        </Reveal>
      )}

      {items.length > 0 ? (
        <Reveal delay={160} className="mt-8">
          <Link
            href={frameworksHref}
            className="inline-flex cursor-pointer items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:underline"
          >
            {hasMore ? copy.ctaAll : copy.cta}
            <ArrowRight className="size-4" />
          </Link>
        </Reveal>
      ) : null}
    </section>
  )
}

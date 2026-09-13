"use client"

import { useMemo, useState } from "react"

import { AppIcon } from "@/components/icons/app-icon"
import { Reveal } from "../reveal"
import { useSiteLocale } from "@/i18n/site-locale-provider"
import { cn } from "@/lib/utils"
import { FRAMEWORK_SCOPES, frameworkScopeEmpty, siteFrameworkScopeLabel, type FrameworkScopeValue } from "@/lib/framework-scope"
import type { Framework } from "@/types"

const tileClassName =
  "surface surface-tile flex min-h-[88px] flex-col items-center justify-center rounded-xl p-3 text-center transition-[transform,colors,box-shadow] duration-300 ease-out hover:z-10 hover:scale-[1.03] hover:-translate-y-0.5 hover:border-foreground/20 hover:shadow-md"

function SegmentedSwitch<T extends string>({ value, options, onChange }: { value: T; options: { value: T; label: string }[]; onChange: (value: T) => void }) {
  if (options.length === 0) return null

  return (
    <div className="inline-flex flex-wrap justify-center gap-1 rounded-full border border-border/60 bg-card/40 p-1">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={cn(
            "rounded-full px-4 py-1.5 text-sm font-medium transition-colors cursor-pointer",
            value === option.value
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}

export function FrameworksView({ frameworks }: { frameworks: Framework[] }) {
  const { t } = useSiteLocale()
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
    label: siteFrameworkScopeLabel(value, t.common) ?? value,
  }))

  if (frameworks.length === 0) {
    return <p className="text-center text-muted-foreground">{t.frameworks.empty}</p>
  }

  if (availableScopes.length === 0) {
    return <p className="text-center text-muted-foreground">{t.frameworks.empty}</p>
  }

  const emptyLabel = frameworkScopeEmpty(effectiveScope, t.frameworks)

  return (
    <div className="space-y-8">
      <div className="flex justify-center">
        <SegmentedSwitch value={effectiveScope} onChange={setScope} options={scopeOptions} />
      </div>

      {items.length > 0 ? (
        <div className="mx-auto grid max-w-4xl gap-3 sm:grid-cols-2">
          {items.map((framework, index) => {
            const scopeLabel = siteFrameworkScopeLabel(framework.scope ?? null, t.common)
            const languages = framework.languages.map((language) => language.name).join(", ")
            const title = [framework.name, scopeLabel, languages].filter(Boolean).join(" — ")

            return (
              <Reveal key={framework.id} variant="scale" delay={80 + index * 60}>
                <article className={tileClassName} title={title}>
                  <AppIcon name={framework.icon} className="size-5" />
                  <span className="mt-2 text-sm font-medium">{framework.name}</span>
                  {scopeLabel ? <span className="mt-1 text-[11px] text-muted-foreground">{scopeLabel}</span> : null}
                  {framework.languages.length > 0 ? (
                    <div className="mt-2 flex flex-wrap justify-center gap-1.5">
                      {framework.languages.map((language) => (
                        <span
                          key={language.id}
                          className="inline-flex items-center gap-1 rounded-full border border-border/60 px-2 py-0.5 text-[10px] text-muted-foreground"
                        >
                          <AppIcon name={language.icon} className="size-3" />
                          {language.name}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </article>
              </Reveal>
            )
          })}
        </div>
      ) : (
        <p className="text-center text-sm text-muted-foreground">{emptyLabel}</p>
      )}
    </div>
  )
}

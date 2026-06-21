"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { AppIcon } from "@/components/icons/app-icon"
import { Reveal } from "../reveal"
import { useSiteLocale } from "@/i18n/site-locale-provider"
import { cn } from "@/lib/utils"
import type { Framework } from "@/types"

type StackScope = "backend" | "frontend"

const tileClassName =
  "surface surface-tile flex min-h-[100px] w-full flex-col items-center justify-center rounded-2xl p-4 text-center transition-[transform,colors,box-shadow] duration-300 ease-out hover:z-10 hover:scale-[1.03] hover:-translate-y-1 hover:border-foreground/20 hover:shadow-lg"

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
    <div className="inline-flex rounded-full border border-border/60 bg-card/40 p-1">
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

function FrameworkTile({ framework }: { framework: Framework }) {
  const { t } = useSiteLocale()
  const languageHint = framework.languages.map((language) => language.name).join(" · ")
  const scope =
    framework.scope === "backend"
      ? t.common.backend
      : framework.scope === "frontend"
        ? t.common.frontend
        : null
  const title = [framework.name, scope, languageHint].filter(Boolean).join(" — ")

  return (
    <article className={tileClassName} title={title}>
      <AppIcon name={framework.icon} className="size-6" />
      <span className="mt-3 text-sm font-medium">{framework.name}</span>
      {languageHint ? (
        <span className="mt-1 text-[11px] text-muted-foreground">{languageHint}</span>
      ) : null}
    </article>
  )
}

export function StackTech({
  frameworks,
  limit = 8,
}: {
  frameworks: Framework[]
  limit?: number
}) {
  const { t, routes } = useSiteLocale()
  const [scope, setScope] = useState<StackScope>("backend")

  const hasBackend = useMemo(
    () => frameworks.some((framework) => framework.scope === "backend"),
    [frameworks],
  )

  const hasFrontend = useMemo(
    () => frameworks.some((framework) => framework.scope === "frontend"),
    [frameworks],
  )

  const effectiveScope = useMemo(() => {
    if (scope === "backend" && hasBackend) return "backend"
    if (scope === "frontend" && hasFrontend) return "frontend"
    if (hasBackend) return "backend"
    if (hasFrontend) return "frontend"
    return scope
  }, [scope, hasBackend, hasFrontend])

  const items = useMemo(
    () => frameworks.filter((framework) => framework.scope === effectiveScope),
    [frameworks, effectiveScope],
  )

  const visibleItems = items.slice(0, limit)
  const hasMore = items.length > limit

  const scopeOptions = [
    ...(hasBackend ? [{ value: "backend" as const, label: t.common.backend }] : []),
    ...(hasFrontend ? [{ value: "frontend" as const, label: t.common.frontend }] : []),
  ]

  if (frameworks.length === 0) return null
  if (!hasBackend && !hasFrontend) return null

  const emptyLabel =
    effectiveScope === "backend" ? t.stackTech.emptyBackend : t.stackTech.emptyFrontend

  return (
    <section id="stack-tech" className="relative isolate z-0 scroll-mt-28 space-y-10">
      <Reveal className="mx-auto max-w-2xl space-y-3 text-center">
        <h2 className="text-3xl font-bold tracking-tight md:text-4xl">{t.stackTech.title}</h2>
        <p className="text-muted-foreground">{t.stackTech.description}</p>
      </Reveal>

      <Reveal delay={80}>
        <div className="flex justify-center">
          <SegmentedSwitch value={effectiveScope} onChange={setScope} options={scopeOptions} />
        </div>
      </Reveal>

      {visibleItems.length > 0 ? (
        <Reveal delay={120}>
          <div className="mx-auto flex w-full max-w-6xl flex-wrap justify-center gap-4 px-6 md:px-10">
            {visibleItems.map((framework, index) => (
              <Reveal
                key={framework.id}
                variant="scale"
                delay={80 + index * 60}
                className="w-32 sm:w-36 md:w-40"
              >
                <FrameworkTile framework={framework} />
              </Reveal>
            ))}
          </div>
        </Reveal>
      ) : (
        <Reveal delay={120}>
          <p className="text-center text-sm text-muted-foreground">{emptyLabel}</p>
        </Reveal>
      )}

      {items.length > 0 ? (
        <Reveal delay={160}>
          <div className="flex justify-center">
            <Link
              href={routes.frameworks}
              className="inline-flex cursor-pointer items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {hasMore ? t.stackTech.ctaAll : t.stackTech.cta}
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </Reveal>
      ) : null}
    </section>
  )
}

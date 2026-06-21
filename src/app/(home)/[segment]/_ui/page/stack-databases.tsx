"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { AppIcon } from "@/components/icons/app-icon"
import { Reveal } from "../reveal"
import { useSiteLocale } from "@/i18n/site-locale-provider"
import { cn } from "@/lib/utils"
import type { Database } from "@/types"

type DatabaseScope = "sql" | "nosql"

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

function DatabaseTile({ database }: { database: Database }) {
  const scope = database.scope === "sql" ? "SQL" : database.scope === "nosql" ? "NoSQL" : null
  const title = scope ? `${database.name} — ${scope}` : database.name

  return (
    <article className={tileClassName} title={title}>
      <AppIcon name={database.icon} className="size-6" />
      <span className="mt-3 text-sm font-medium">{database.name}</span>
    </article>
  )
}

export function StackDatabases({
  databases,
  limit = 8,
}: {
  databases: Database[]
  limit?: number
}) {
  const { t, routes } = useSiteLocale()
  const [scope, setScope] = useState<DatabaseScope>("sql")

  const hasSql = useMemo(
    () => databases.some((database) => database.scope === "sql"),
    [databases],
  )

  const hasNosql = useMemo(
    () => databases.some((database) => database.scope === "nosql"),
    [databases],
  )

  const effectiveScope = useMemo(() => {
    if (scope === "sql" && hasSql) return "sql"
    if (scope === "nosql" && hasNosql) return "nosql"
    if (hasSql) return "sql"
    if (hasNosql) return "nosql"
    return scope
  }, [scope, hasSql, hasNosql])

  const items = useMemo(
    () => databases.filter((database) => database.scope === effectiveScope),
    [databases, effectiveScope],
  )

  const visibleItems = items.slice(0, limit)
  const hasMore = items.length > limit

  const scopeOptions = [
    ...(hasSql ? [{ value: "sql" as const, label: t.common.sql }] : []),
    ...(hasNosql ? [{ value: "nosql" as const, label: t.common.nosql }] : []),
  ]

  if (databases.length === 0) return null
  if (!hasSql && !hasNosql) return null

  const emptyLabel = effectiveScope === "sql" ? t.stackDatabases.emptySql : t.stackDatabases.emptyNosql

  return (
    <section id="stack-databases" className="relative isolate z-0 scroll-mt-28 space-y-10">
      <Reveal className="mx-auto max-w-2xl space-y-3 text-center">
        <h2 className="text-3xl font-bold tracking-tight md:text-4xl">{t.stackDatabases.title}</h2>
        <p className="text-muted-foreground">{t.stackDatabases.description}</p>
      </Reveal>

      <Reveal delay={80}>
        <div className="flex justify-center">
          <SegmentedSwitch value={effectiveScope} onChange={setScope} options={scopeOptions} />
        </div>
      </Reveal>

      {visibleItems.length > 0 ? (
        <Reveal delay={120}>
          <div className="mx-auto flex w-full max-w-6xl flex-wrap justify-center gap-4 px-6 md:px-10">
            {visibleItems.map((database, index) => (
              <Reveal
                key={database.id}
                variant="scale"
                delay={80 + index * 60}
                className="w-32 sm:w-36 md:w-40"
              >
                <DatabaseTile database={database} />
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
              href={routes.databases}
              className="inline-flex cursor-pointer items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {hasMore ? t.stackDatabases.ctaAll : t.stackDatabases.cta}
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </Reveal>
      ) : null}
    </section>
  )
}

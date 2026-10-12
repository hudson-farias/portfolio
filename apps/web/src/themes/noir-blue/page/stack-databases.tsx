"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { AppIcon } from "@/components/icons/app-icon"
import { cn } from "@/lib/utils"
import type { Dictionary } from "@/i18n/dictionary"
import type { Database, DatabasesCopy } from "@/themes/types"

import { Reveal } from "../reveal"
import { SectionEyebrow, SectionLead, SectionTitle } from "../section-heading"

type DatabaseScope = "sql" | "nosql"

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

function DatabaseTile({ database }: { database: Database }) {
  const scope = database.scope === "sql" ? "SQL" : database.scope === "nosql" ? "NoSQL" : null
  const title = scope ? `${database.name} — ${scope}` : database.name

  return (
    <article className={tileClassName} title={title}>
      <div className="mb-4 flex items-center justify-between gap-2">
        <AppIcon name={database.icon} className="size-7" />
        {scope ? (
          <span className="rounded-md border border-border/60 bg-background px-2 py-0.5 text-xs font-medium text-primary">
            {scope}
          </span>
        ) : null}
      </div>
      <h4 className="font-heading text-base font-semibold tracking-tight">{database.name}</h4>
    </article>
  )
}

export function StackDatabases({
  databases,
  copy,
  common,
  databasesHref,
  limit = 8,
}: {
  databases: Database[]
  copy: DatabasesCopy
  common: Pick<Dictionary["common"], "sql" | "nosql">
  databasesHref: string
  limit?: number
}) {
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
    ...(hasSql ? [{ value: "sql" as const, label: common.sql }] : []),
    ...(hasNosql ? [{ value: "nosql" as const, label: common.nosql }] : []),
  ]

  if (databases.length === 0) return null
  if (!hasSql && !hasNosql) return null

  const emptyLabel = effectiveScope === "sql" ? copy.emptySql : copy.emptyNosql

  return (
    <section id="stack-databases" className="scroll-mt-28 border-t border-border/30 pt-16 md:pt-24">
      <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <Reveal>
          <SectionEyebrow>05 / {copy.title}</SectionEyebrow>
          <SectionTitle>{copy.title}</SectionTitle>
          <SectionLead className="mt-2 max-w-xl">{copy.description}</SectionLead>
        </Reveal>

        <Reveal delay={80}>
          <SegmentedSwitch value={effectiveScope} onChange={setScope} options={scopeOptions} />
        </Reveal>
      </div>

      {visibleItems.length > 0 ? (
        <Reveal delay={120}>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {visibleItems.map((database, index) => (
              <Reveal key={database.id} variant="scale" delay={80 + index * 50}>
                <DatabaseTile database={database} />
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
            href={databasesHref}
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

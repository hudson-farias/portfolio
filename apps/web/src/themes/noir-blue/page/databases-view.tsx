"use client"

import { useMemo, useState } from "react"

import { AppIcon } from "@/components/icons/app-icon"
import { cn } from "@/lib/utils"
import type { Dictionary } from "@/i18n/dictionary"
import type { Database } from "@/themes/types"

import { Reveal } from "../reveal"

type DatabaseScope = "sql" | "nosql"

type DatabasesViewCopy = Pick<
  Dictionary["databases"],
  "empty" | "emptySql" | "emptyNosql"
>

const tileClassName =
  "noir-tile group flex min-h-[160px] w-full flex-col justify-between rounded-xl border border-border/40 bg-card p-5 transition-colors hover:border-primary/50"

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
    <div className="inline-flex flex-wrap items-center gap-1 self-start rounded-lg border border-border/40 bg-card/60 p-1">
      {options.map((option) => {
        const active = value === option.value
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={cn(
              "inline-flex cursor-pointer items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
              active
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <span>{option.label}</span>
            <span
              className={cn(
                "rounded px-1.5 py-0.5 font-mono text-[10px]",
                active
                  ? "bg-primary-foreground/15 text-primary-foreground"
                  : "bg-muted text-muted-foreground",
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

function DatabaseTile({ database }: { database: Database }) {
  const scope = database.scope === "sql" ? "SQL" : database.scope === "nosql" ? "NoSQL" : null
  const title = scope ? `${database.name} — ${scope}` : database.name

  return (
    <article className={tileClassName} title={title}>
      <div>
        <div className="mb-3 flex items-center justify-between gap-2">
          <AppIcon
            name={database.icon}
            className="size-[22px] text-primary transition-transform group-hover:scale-105"
          />
          {scope ? (
            <span className="rounded border border-primary/30 bg-primary/10 px-2 py-0.5 font-mono text-[10px] font-medium text-primary">
              {scope}
            </span>
          ) : null}
        </div>
        <h2 className="font-heading text-base font-semibold tracking-tight text-foreground">
          {database.name}
        </h2>
      </div>
    </article>
  )
}

export function DatabasesView({
  databases,
  copy,
  common,
}: {
  databases: Database[]
  copy: DatabasesViewCopy
  common: Pick<Dictionary["common"], "sql" | "nosql">
}) {
  const [scope, setScope] = useState<DatabaseScope>("sql")

  const sqlCount = useMemo(
    () => databases.filter((database) => database.scope === "sql").length,
    [databases],
  )

  const nosqlCount = useMemo(
    () => databases.filter((database) => database.scope === "nosql").length,
    [databases],
  )

  const hasSql = sqlCount > 0
  const hasNosql = nosqlCount > 0

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

  const scopeOptions = [
    ...(hasSql ? [{ value: "sql" as const, label: common.sql, count: sqlCount }] : []),
    ...(hasNosql ? [{ value: "nosql" as const, label: common.nosql, count: nosqlCount }] : []),
  ]

  if (databases.length === 0) {
    return <p className="text-center text-muted-foreground">{copy.empty}</p>
  }

  if (!hasSql && !hasNosql) {
    return <p className="text-center text-muted-foreground">{copy.empty}</p>
  }

  const emptyLabel = effectiveScope === "sql" ? copy.emptySql : copy.emptyNosql
  const activeCount = effectiveScope === "sql" ? sqlCount : nosqlCount
  const activeLabel = effectiveScope === "sql" ? common.sql : common.nosql

  return (
    <div className="space-y-6">
      <Reveal delay={40}>
        <div className="flex flex-col justify-between gap-4 border-b border-border/30 pb-4 sm:flex-row sm:items-center">
          <SegmentedSwitch value={effectiveScope} onChange={setScope} options={scopeOptions} />
          <div className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
            <span aria-hidden className="size-2 shrink-0 animate-pulse rounded-full bg-primary" />
            <span>
              {activeLabel}: {activeCount}
            </span>
          </div>
        </div>
      </Reveal>

      {items.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((database, index) => (
            <Reveal key={database.id} variant="scale" delay={80 + index * 50}>
              <DatabaseTile database={database} />
            </Reveal>
          ))}
        </div>
      ) : (
        <Reveal delay={80}>
          <p className="text-sm text-muted-foreground">{emptyLabel}</p>
        </Reveal>
      )}
    </div>
  )
}

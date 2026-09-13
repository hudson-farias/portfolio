"use client"

import { useEffect, useState } from "react"

import { Search, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TextInput } from "./form-fields"

const EMPTY_VALUE = "__empty__"

const controlClass = "h-9 min-w-[9rem] py-1.5"

export function AdminFilterField({
  label,
  children,
  className,
}: {
  label: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <label className={cn("flex min-w-0 flex-col gap-1.5", className)}>
      <span className="text-sm font-medium leading-none">{label}</span>
      {children}
    </label>
  )
}

export function AdminFilterSelect({
  value,
  onValueChange,
  options,
  className,
}: {
  value: string
  onValueChange: (value: string) => void
  options: { value: string; label: string }[]
  className?: string
}) {
  return (
    <Select value={value || EMPTY_VALUE} onValueChange={(next) => onValueChange(next === EMPTY_VALUE ? "" : next)}>
      <SelectTrigger className={cn("h-9 w-full min-w-[9rem] bg-background", className)}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent position="popper" align="start">
        {options.map((option) => (
          <SelectItem key={option.value || EMPTY_VALUE} value={option.value || EMPTY_VALUE}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export function AdminListFilters({
  search,
  onSearchSubmit,
  onClear,
  children,
}: {
  search: string
  onSearchSubmit: (value: string) => void
  onClear?: () => void
  children?: React.ReactNode
}) {
  const [draft, setDraft] = useState(search)

  useEffect(() => {
    setDraft(search)
  }, [search])

  function submitSearch() {
    onSearchSubmit(draft)
  }

  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900/50">
      <div className="flex flex-wrap items-end gap-3">
        <AdminFilterField label="Pesquisar" className="min-w-[min(100%,240px)] flex-1 basis-[280px]">
          <div className="flex gap-2">
            <div className="relative min-w-0 flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-400" />
              <TextInput
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    submitSearch()
                  }
                }}
                placeholder="Buscar..."
                className={cn(controlClass, "pl-9")}
              />
            </div>
            <Button type="button" size="lg" variant="outline" className="shrink-0 gap-1.5" onClick={submitSearch}>
              <Search className="size-3.5" />
              Buscar
            </Button>
          </div>
        </AdminFilterField>

        {children}

        {onClear && (
          <Button type="button" size="lg" variant="outline" className="shrink-0 gap-1.5" onClick={onClear}>
            <X className="size-3.5" />
            Limpar
          </Button>
        )}
      </div>
    </div>
  )
}

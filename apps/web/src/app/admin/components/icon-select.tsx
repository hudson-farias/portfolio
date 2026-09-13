"use client"

import { useEffect, useRef, useState } from "react"
import { ChevronDown } from "lucide-react"
import { AppIcon } from "@/components/icons/app-icon"
import { iconNames } from "@/components/icons/map"
import { cn } from "@/lib/utils"

export const IconSelect = ({
  value,
  onChange,
  required,
  options = iconNames,
}: {
  value: string
  onChange: (value: string) => void
  required?: boolean
  options?: readonly string[]
}) => {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const selectOptions = [...options, ...(value && !options.includes(value) ? [value] : [])].sort(
    (a, b) => a.localeCompare(b),
  )

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false)
    }

    if (open) document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [open])

  return (
    <div ref={containerRef} className="relative">
      {required ? <input type="text" value={value} readOnly required className="sr-only" tabIndex={-1} /> : null}

      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="flex w-full items-center justify-between gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition-colors hover:border-zinc-300 focus:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100 dark:hover:border-zinc-600 dark:focus:border-zinc-500"
      >
        <span className="flex min-w-0 items-center gap-2">
          {value ? (
            <>
              <AppIcon name={value} className="size-4 shrink-0" />
              <span className="truncate font-mono text-xs">{value}</span>
            </>
          ) : (
            <span className="text-zinc-500 dark:text-zinc-400">Selecione um ícone</span>
          )}
        </span>
        <ChevronDown className={cn("size-4 shrink-0 text-zinc-500 transition-transform", open && "rotate-180")} />
      </button>

      {open ? (
        <div className="absolute z-50 mt-1 max-h-56 w-full overflow-y-auto rounded-lg border border-zinc-200 bg-white p-2 shadow-lg dark:border-zinc-700 dark:bg-zinc-950">
          <div className="grid grid-cols-1 gap-1 sm:grid-cols-2">
            {selectOptions.map((name) => (
              <button
                key={name}
                type="button"
                onClick={() => {
                  onChange(name)
                  setOpen(false)
                }}
                className={cn(
                  "flex items-center gap-2 rounded-md px-2.5 py-2 text-left text-sm text-zinc-900 transition-colors hover:bg-zinc-100 dark:text-zinc-100 dark:hover:bg-zinc-800",
                  value === name && "bg-zinc-100 dark:bg-zinc-800",
                )}
              >
                <AppIcon name={name} className="size-4 shrink-0" />
                <span className="truncate font-mono text-xs">{name}</span>
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  )
}

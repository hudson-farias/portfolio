"use client"

import { AppIcon } from "@/components/icons/app-icon"
import type { AdminFramework } from "../frameworks/interfaces"

export function FrameworkPicker({
  frameworks,
  selectedIds,
  disabled,
  onToggle,
}: {
  frameworks: AdminFramework[]
  selectedIds: number[]
  disabled?: boolean
  onToggle: (frameworkId: number) => void
}) {
  if (frameworks.length === 0) {
    return <p className="text-sm text-zinc-500">Cadastre frameworks antes de vincular.</p>
  }

  return (
    <div className="grid max-h-48 gap-2 overflow-y-auto rounded-lg border border-zinc-200 p-3 dark:border-zinc-700">
      {frameworks.map((framework) => {
        const languageHint = framework.languages.map((language) => language.name).join(", ")

        return (
          <label key={framework.id} className="flex cursor-pointer items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300">
            <input
              type="checkbox"
              disabled={disabled}
              checked={selectedIds.includes(framework.id)}
              onChange={() => onToggle(framework.id)}
              className="size-4 rounded border-zinc-300 accent-zinc-900 dark:border-zinc-600 dark:accent-zinc-100"
            />
            <AppIcon name={framework.icon} className="size-4 shrink-0" />
            <span>
              {framework.name}
              {languageHint ? <span className="text-zinc-500"> — {languageHint}</span> : null}
            </span>
          </label>
        )
      })}
    </div>
  )
}

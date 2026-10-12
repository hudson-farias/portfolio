"use client"

import { AppIcon } from "@/components/icons/app-icon"
import type { FrameworkRef } from "@/types"

export function FrameworkBadges({ frameworks }: { frameworks?: FrameworkRef[] }) {
  if (!frameworks?.length) return null

  return (
    <div className="flex flex-wrap gap-2">
      {frameworks.map((framework) => {
        const languageHint = framework.languages.map((language) => language.name).join(", ")
        const title = languageHint ? `${framework.name} — ${languageHint}` : framework.name

        return (
          <span
            key={framework.id}
            title={title}
            className="inline-flex items-center gap-1.5 rounded-full border border-border/60 px-3 py-1 text-xs text-muted-foreground"
          >
            <AppIcon name={framework.icon} className="size-3.5 shrink-0" />
            {framework.name}
          </span>
        )
      })}
    </div>
  )
}

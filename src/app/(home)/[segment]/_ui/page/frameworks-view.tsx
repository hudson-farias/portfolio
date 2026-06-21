"use client"

import { AppIcon } from "@/components/icons/app-icon"
import { Reveal } from "../reveal"
import { useSiteLocale } from "@/i18n/site-locale-provider"
import type { Framework } from "@/types"

const tileClassName =
  "surface surface-tile flex min-h-[88px] flex-col items-center justify-center rounded-xl p-3 text-center transition-[transform,colors,box-shadow] duration-300 ease-out hover:z-10 hover:scale-[1.03] hover:-translate-y-0.5 hover:border-foreground/20 hover:shadow-md"

function scopeLabel(scope: Framework["scope"], t: ReturnType<typeof useSiteLocale>["t"]) {
  if (scope === "backend") return t.common.backend
  if (scope === "frontend") return t.common.frontend
  return null
}

export function FrameworksView({ frameworks }: { frameworks: Framework[] }) {
  const { t } = useSiteLocale()

  if (frameworks.length === 0) {
    return <p className="text-center text-muted-foreground">{t.frameworks.empty}</p>
  }

  return (
    <div className="mx-auto grid max-w-4xl gap-3 sm:grid-cols-2">
      {frameworks.map((framework, index) => {
        const scope = scopeLabel(framework.scope, t)
        const languages = framework.languages.map((language) => language.name).join(", ")
        const title = [framework.name, scope, languages].filter(Boolean).join(" — ")

        return (
          <Reveal key={framework.id} variant="scale" delay={80 + index * 60}>
            <article className={tileClassName} title={title}>
              <AppIcon name={framework.icon} className="size-5" />
              <span className="mt-2 text-sm font-medium">{framework.name}</span>
              {scope ? <span className="mt-1 text-[11px] text-muted-foreground">{scope}</span> : null}
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
  )
}

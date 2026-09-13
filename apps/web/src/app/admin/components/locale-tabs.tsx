"use client"

import { cn } from "@/lib/utils"
import type { LocaleCode } from "@/lib/admin/locale"

export const LocaleTabs = ({ active, onChange, enPending = false }: { active: LocaleCode; onChange: (locale: LocaleCode) => void; enPending?: boolean }) => {
  return (
    <div className="flex gap-1 rounded-lg border border-zinc-200 bg-zinc-50 p-1 dark:border-zinc-800 dark:bg-zinc-900/50">
      {(["pt", "en"] as LocaleCode[]).map((locale) => (
        <button
          key={locale}
          type="button"
          onClick={() => onChange(locale)}
          className={cn(
            "relative rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
            active === locale
              ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-800 dark:text-zinc-100"
              : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100",
          )}
        >
          {locale.toUpperCase()}
          {locale === "en" && enPending && (
            <span className="ml-1.5 rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-800 dark:bg-amber-950 dark:text-amber-200">
              pendente
            </span>
          )}
        </button>
      ))}
    </div>
  )
}

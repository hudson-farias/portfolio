import type { ReactNode } from "react"
import Link from "next/link"

import { ArrowLeft, Save } from "lucide-react"

import { Button } from "@/components/ui/button"

export const FormPageLayout = ({ backHref, backLabel, title, description, canMutate, submitting, submitLabel = "Salvar", onSubmit, children }: { backHref: string; backLabel: string; title: string; description?: string; canMutate: boolean; submitting: boolean; submitLabel?: string; onSubmit: (event: React.FormEvent) => void; children: ReactNode }) => {
  return (
    <div className="space-y-4 p-6 md:p-8">
      <Link
        href={backHref}
        className="inline-flex items-center gap-1.5 text-sm text-zinc-500 transition-colors hover:text-zinc-900 dark:hover:text-zinc-100"
      >
        <ArrowLeft className="size-4" />
        {backLabel}
      </Link>

      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        {description && <p className="mt-1 text-sm text-zinc-500">{description}</p>}
      </div>

      <form
        onSubmit={onSubmit}
        className="overflow-hidden rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900"
      >
        <div className="space-y-5 p-6 md:p-8">{children}</div>

        {canMutate && (
          <div className="flex flex-wrap items-center justify-end gap-3 border-t border-zinc-200 bg-zinc-50 px-6 py-4 dark:border-zinc-800 dark:bg-zinc-900/50 md:px-8">
            <Button type="button" variant="outline" asChild>
              <Link href={backHref}>Cancelar</Link>
            </Button>
            <Button type="submit" className="gap-1.5" disabled={submitting}>
              <Save className="size-4" />
              {submitting ? "Salvando..." : submitLabel}
            </Button>
          </div>
        )}
      </form>
    </div>
  )
}

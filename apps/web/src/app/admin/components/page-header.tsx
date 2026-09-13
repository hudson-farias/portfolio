import type { ElementType } from "react"
import Link from "next/link"

import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"

export function PageHeader({ title, description, icon: Icon, canMutate, onAdd, addHref, addLabel = "Adicionar" }: { title: string; description: string; icon: ElementType; canMutate: boolean; onAdd?: () => void; addHref?: string; addLabel?: string }) {
  return (
    <header className="flex flex-wrap items-start justify-between gap-4 border-b border-zinc-200 px-6 py-5 dark:border-zinc-800 md:px-8">
      <div className="flex items-start gap-3">
        <div className="flex size-10 items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800">
          <Icon className="size-5 text-zinc-600 dark:text-zinc-300" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          <p className="mt-1 text-sm text-zinc-500">{description}</p>
        </div>
      </div>

      {canMutate && addHref && (
        <Button className="gap-1.5" asChild>
          <Link href={addHref}>
            <Plus className="size-4" />
            {addLabel}
          </Link>
        </Button>
      )}

      {canMutate && !addHref && onAdd && (
        <Button className="gap-1.5" onClick={onAdd}>
          <Plus className="size-4" />
          {addLabel}
        </Button>
      )}
    </header>
  )
}

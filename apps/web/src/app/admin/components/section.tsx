import type { ElementType } from "react"

import Link from "next/link"

import { ArrowRight, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"

export function Section({
    title,
    description,
    icon: Icon,
    canMutate,
    onAdd,
    href,
    children,
}: {
    title: string
    description: string
    icon: ElementType
    canMutate: boolean
    onAdd?: () => void
    href?: string
    children: React.ReactNode
}) {
    return (
        <section className="rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex items-start justify-between gap-3 border-b border-zinc-200 px-5 py-4 dark:border-zinc-800">
                <div className="flex items-start gap-3">
                    <div className="flex size-9 items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800">
                        <Icon className="size-4 text-zinc-600 dark:text-zinc-300" />
                    </div>
                    <div>
                        <h2 className="font-semibold">{title}</h2>
                        <p className="text-sm text-zinc-500">{description}</p>
                    </div>
                </div>
                <div className="flex shrink-0 gap-2">
                    {href && (
                        <Button size="sm" variant="outline" className="gap-1.5" asChild>
                            <Link href={href}>
                                Gerenciar
                                <ArrowRight className="size-3.5" />
                            </Link>
                        </Button>
                    )}
                    {canMutate && onAdd && (
                        <Button size="sm" variant="outline" className="gap-1.5" onClick={onAdd}>
                            <Plus className="size-3.5" />
                            Adicionar
                        </Button>
                    )}
                </div>
            </div>
            <div className="p-5">{children}</div>
        </section>
    )
}
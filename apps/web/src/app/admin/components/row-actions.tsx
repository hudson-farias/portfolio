import Link from "next/link"

import { Pencil, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"

export function RowActions({ canMutate, onEdit, editHref, onDelete, hideEdit = false }: { canMutate: boolean; onEdit?: () => void; editHref?: string; onDelete: () => void; hideEdit?: boolean }) {
    if (!canMutate) return null

    return (
        <div className="flex shrink-0 gap-1">
            {!hideEdit && editHref && (
                <Button size="icon-xs" variant="ghost" aria-label="Editar" asChild>
                    <Link href={editHref}>
                        <Pencil className="size-3.5" />
                    </Link>
                </Button>
            )}
            {!hideEdit && !editHref && onEdit && (
                <Button size="icon-xs" variant="ghost" aria-label="Editar" onClick={onEdit}>
                    <Pencil className="size-3.5" />
                </Button>
            )}
            <Button size="icon-xs" variant="ghost" aria-label="Excluir" onClick={onDelete}>
                <Trash2 className="size-3.5" />
            </Button>
        </div>
    )
}

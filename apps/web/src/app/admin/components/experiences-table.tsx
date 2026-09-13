import { ChevronDown, ChevronUp } from "lucide-react"

import type { AdminExperience } from "@/app/admin/experiences/interfaces"
import type { Experience } from "@/types"
import { SanitizedHtml } from "@/components/sanitized-html"
import { Button } from "@/components/ui/button"

import { RowActions } from "./row-actions"
import { AdminTable, adminActionsCol, adminBodyRow, adminHeadRow, adminTd, adminTh } from "./admin-table"

type ExperienceItem = AdminExperience | Experience

function displayRole(item: ExperienceItem) {
  if ("role_title" in item) return item.role_title ?? "—"
  return item.role
}

export function ExperiencesTable({ items, canMutate, onEdit, getEditHref, onDelete, onMove, reordering = false }: { items: ExperienceItem[]; canMutate: boolean; onEdit?: (item: ExperienceItem) => void; getEditHref?: (item: ExperienceItem) => string; onDelete?: (id: number) => void; onMove?: (index: number, direction: -1 | 1) => void; reordering?: boolean }) {
  const showOrder = Boolean(canMutate && onMove)

  return (
    <AdminTable scrollable>
      <thead>
        <tr className={adminHeadRow}>
          {showOrder && <th className={adminTh("w-20")}>Ordem</th>}
          <th className={adminTh("min-w-36")}>Empresa</th>
          <th className={adminTh("min-w-36")}>Cargo</th>
          <th className={adminTh("w-24")}>Contrato</th>
          <th className={adminTh("w-36")}>Período</th>
          <th className={adminTh("min-w-64")}>Descrição</th>
          <th className={adminTh("min-w-36")}>Site da empresa</th>
          {canMutate && <th className={adminTh("w-24")}>Status</th>}
          {canMutate && <th className={adminTh(adminActionsCol)}>Ações</th>}
        </tr>
      </thead>
      <tbody>
        {items.map((item, index) => (
          <tr key={item.id} className={adminBodyRow}>
            {showOrder && (
              <td className={adminTd()}>
                <div className="flex items-center gap-1">
                  <span className="w-5 text-center text-xs text-zinc-500">{index + 1}</span>
                  <Button
                    type="button"
                    size="icon-xs"
                    variant="ghost"
                    aria-label={`Mover ${item.company} para cima`}
                    disabled={reordering || index === 0}
                    onClick={() => onMove?.(index, -1)}
                  >
                    <ChevronUp className="size-3.5" />
                  </Button>
                  <Button
                    type="button"
                    size="icon-xs"
                    variant="ghost"
                    aria-label={`Mover ${item.company} para baixo`}
                    disabled={reordering || index === items.length - 1}
                    onClick={() => onMove?.(index, 1)}
                  >
                    <ChevronDown className="size-3.5" />
                  </Button>
                </div>
              </td>
            )}
            <td className={adminTd("font-medium")}>{item.company}</td>
            <td className={adminTd()}>{displayRole(item)}</td>
            <td className={adminTd("text-zinc-500")}>
              {"contract_type" in item && item.contract_type ? item.contract_type : "—"}
            </td>
            <td className={adminTd("whitespace-nowrap text-zinc-500")}>{item.period}</td>
            <td className={adminTd("text-zinc-600 dark:text-zinc-400")}>
              <SanitizedHtml
                html={item.description}
                className="line-clamp-4 space-y-0 text-sm leading-relaxed [&_p+p]:mt-1"
              />
            </td>
            <td className={adminTd("text-zinc-500")}>
              {"live_url" in item && item.live_url ? (
                <a
                  href={item.live_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline-offset-4 hover:underline"
                >
                  Site da empresa
                </a>
              ) : (
                "—"
              )}
            </td>
            {canMutate && (
              <td className={adminTd()}>
                {item.hidden ? (
                  <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800 dark:bg-amber-950 dark:text-amber-200">
                    Oculta
                  </span>
                ) : (
                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200">
                    Visível
                  </span>
                )}
              </td>
            )}
            {canMutate && (onEdit || getEditHref) && onDelete && (
              <td className={adminTd()}>
                <RowActions
                  canMutate
                  editHref={getEditHref?.(item)}
                  onEdit={getEditHref ? undefined : () => onEdit?.(item)}
                  onDelete={() => onDelete(item.id)}
                />
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </AdminTable>
  )
}

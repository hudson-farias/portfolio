import type { AdminExperience } from "@/app/admin/experiences/interfaces"
import type { Experience } from "@/types"
import { SanitizedHtml } from "@/components/sanitized-html"

import { RowActions } from "./row-actions"
import { AdminTable, adminActionsCol, adminBodyRow, adminHeadRow, adminTd, adminTh } from "./admin-table"

type ExperienceItem = AdminExperience | Experience

function displayRole(item: ExperienceItem) {
  if ("role_title" in item) return item.role_title ?? "—"
  return item.role
}

export function ExperiencesTable({
  items,
  canMutate,
  onEdit,
  onDelete,
}: {
  items: ExperienceItem[]
  canMutate: boolean
  onEdit?: (item: ExperienceItem) => void
  onDelete?: (id: number) => void
}) {
  return (
    <AdminTable scrollable>
      <thead>
        <tr className={adminHeadRow}>
          <th className={adminTh("min-w-36")}>Empresa</th>
          <th className={adminTh("min-w-36")}>Cargo</th>
          <th className={adminTh("w-24")}>Contrato</th>
          <th className={adminTh("w-36")}>Período</th>
          <th className={adminTh("min-w-64")}>Descrição</th>
          {canMutate && <th className={adminTh("w-24")}>Status</th>}
          {canMutate && <th className={adminTh(adminActionsCol)}>Ações</th>}
        </tr>
      </thead>
      <tbody>
        {items.map((item) => (
          <tr key={item.id} className={adminBodyRow}>
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
            {canMutate && onEdit && onDelete && (
              <td className={adminTd()}>
                <RowActions
                  canMutate
                  onEdit={() => onEdit(item)}
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

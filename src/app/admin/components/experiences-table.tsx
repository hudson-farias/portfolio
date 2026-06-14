import type { AdminExperience } from "@/app/admin/experiences/interfaces"
import type { Experience } from "@/types"
import { SanitizedHtml } from "@/components/sanitized-html"

import { RowActions } from "./row-actions"

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
    <div className="overflow-x-auto">
      <table className="w-full min-w-[800px] text-left text-sm">
        <thead>
          <tr className="border-b border-zinc-200 text-zinc-500 dark:border-zinc-800">
            <th className="pb-3 pr-4 font-medium">Empresa</th>
            <th className="pb-3 pr-4 font-medium">Cargo</th>
            <th className="pb-3 pr-4 font-medium">Contrato</th>
            <th className="pb-3 pr-4 font-medium">Período</th>
            <th className="pb-3 pr-4 font-medium">Descrição</th>
            {canMutate && <th className="pb-3 pr-4 font-medium">Status</th>}
            {canMutate && <th className="pb-3 font-medium">Ações</th>}
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} className="border-b border-zinc-100 last:border-0 dark:border-zinc-800/80">
              <td className="py-3 pr-4 font-medium">{item.company}</td>
              <td className="py-3 pr-4">{displayRole(item)}</td>
              <td className="py-3 pr-4 text-zinc-500">
                {"contract_type" in item && item.contract_type ? item.contract_type : "—"}
              </td>
              <td className="py-3 pr-4 whitespace-nowrap text-zinc-500">{item.period}</td>
              <td className="py-3 pr-4 max-w-xs text-zinc-600 dark:text-zinc-400">
                <SanitizedHtml
                  html={item.description}
                  className="line-clamp-4 space-y-0 text-sm leading-relaxed [&_p+p]:mt-1"
                />
              </td>
              {canMutate && (
                <td className="py-3 pr-4">
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
                <td className="py-3">
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
      </table>
    </div>
  )
}

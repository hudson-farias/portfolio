import { AppIcon } from "@/components/icons/app-icon"
import { RowActions } from "./row-actions"
import { AdminTable, adminActionsCol, adminBodyRow, adminHeadRow, adminTd, adminTh } from "./admin-table"
import type { AdminTool } from "../tools/interfaces"

export const ToolsTable = ({ items, canMutate }: { items: AdminTool[]; canMutate: boolean }) => {
  return (
    <AdminTable>
      <thead>
        <tr className={adminHeadRow}>
          <th className={adminTh()}>Ferramenta</th>
          <th className={adminTh()}>URL</th>
          {canMutate && <th className={adminTh(adminActionsCol)}>Ações</th>}
        </tr>
      </thead>
      <tbody>
        {items.map((item) => (
          <tr key={item.id} className={adminBodyRow}>
            <td className={adminTd()}>
              <span className="inline-flex items-center gap-2">
                <AppIcon name={item.icon} className="size-4" />
                <span className="font-medium">{item.name}</span>
              </span>
            </td>
            <td className={adminTd()}>
              {item.url ? (
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="break-all text-zinc-600 underline-offset-4 hover:underline dark:text-zinc-400"
                >
                  {item.url}
                </a>
              ) : (
                <span className="text-zinc-500">—</span>
              )}
            </td>
            {canMutate && (
              <td className={adminTd()}>
                <RowActions
                  canMutate
                  onEdit={() => console.log("edit tool", item.id)}
                  onDelete={() => console.log("delete tool", item.id)}
                />
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </AdminTable>
  )
}

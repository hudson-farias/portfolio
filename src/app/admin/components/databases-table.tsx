import { AppIcon } from "@/components/icons/app-icon"
import { AdminTable, adminBodyRow, adminHeadRow, adminTd, adminTh } from "./admin-table"
import type { AdminDatabase } from "../databases/interfaces"

function scopeLabel(scope: AdminDatabase["scope"]) {
  if (scope === "sql") return "SQL"
  if (scope === "nosql") return "NoSQL"
  return "—"
}

export const DatabasesTable = ({ items }: { items: AdminDatabase[] }) => {
  return (
    <AdminTable>
      <thead>
        <tr className={adminHeadRow}>
          <th className={adminTh()}>Banco</th>
          <th className={adminTh()}>Tipo</th>
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
            <td className={adminTd()}>{scopeLabel(item.scope)}</td>
          </tr>
        ))}
      </tbody>
    </AdminTable>
  )
}

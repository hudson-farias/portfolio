import { adminFrameworkScopeLabel } from "@/lib/framework-scope"
import type { AdminFramework } from "../frameworks/interfaces"
import { AppIcon } from "@/components/icons/app-icon"
import { AdminTable, adminBodyRow, adminHeadRow, adminTd, adminTh } from "./admin-table"

export const FrameworksTable = ({ items }: { items: AdminFramework[] }) => {
  return (
    <AdminTable>
      <thead>
        <tr className={adminHeadRow}>
          <th className={adminTh()}>Framework</th>
          <th className={adminTh()}>Escopo</th>
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
            <td className={adminTd()}>{adminFrameworkScopeLabel(item.scope)}</td>
          </tr>
        ))}
      </tbody>
    </AdminTable>
  )
}

import { AppIcon } from "@/components/icons/app-icon"
import { AdminTable, adminBodyRow, adminHeadRow, adminTd, adminTh } from "./admin-table"
import type { AdminLanguage } from "../languages/interfaces"

export const LanguagesTable = ({ items }: { items: AdminLanguage[] }) => {
  return (
    <AdminTable>
      <thead>
        <tr className={adminHeadRow}>
          <th className={adminTh()}>Linguagem</th>
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
          </tr>
        ))}
      </tbody>
    </AdminTable>
  )
}

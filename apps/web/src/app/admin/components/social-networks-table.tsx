import { AppIcon } from "@/components/icons/app-icon"
import { formatLandpageSections } from "@/lib/admin/landpage-sections"
import { RowActions } from "./row-actions"
import { AdminTable, adminActionsCol, adminBodyRow, adminHeadRow, adminTd, adminTh } from "./admin-table"
import type { AdminSocialNetwork } from "../social-networks/interfaces"

export const SocialNetworksTable = ({ items, canMutate, }: { items: AdminSocialNetwork[]; canMutate: boolean }) => {
  return (
    <AdminTable>
      <thead>
        <tr className={adminHeadRow}>
          <th className={adminTh("w-12")}>Ícone</th>
          <th className={adminTh()}>URL</th>
          <th className={adminTh("w-48")}>Seções</th>
          {canMutate && <th className={adminTh(adminActionsCol)}>Ações</th>}
        </tr>
      </thead>
      <tbody>
        {items.map((item) => (
          <tr key={item.id} className={adminBodyRow}>
            <td className={adminTd()}>
              <span className="inline-flex items-center gap-2">
                <AppIcon name={item.icon} className="size-4" />
                <span className="font-mono text-xs">{item.icon}</span>
              </span>
            </td>
            <td className={adminTd()}>
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="break-all text-zinc-600 underline-offset-4 hover:underline dark:text-zinc-400"
              >
                {item.url}
              </a>
            </td>
            <td className={adminTd()}>
              <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium dark:bg-zinc-800">
                {formatLandpageSections(item.positions)}
              </span>
            </td>
            {canMutate && (
              <td className={adminTd()}>
                <RowActions
                  canMutate
                  onEdit={() => console.log("edit social", item.id)}
                  onDelete={() => console.log("delete social", item.id)}
                />
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </AdminTable>
  )
}

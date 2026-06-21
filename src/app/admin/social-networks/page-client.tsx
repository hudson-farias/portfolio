"use client"

import { useRouter } from "next/navigation"

import { Share2 } from "lucide-react"

import { API } from "@/api/client"
import type { SocialNetworksPageClientProps } from "./interfaces"
import { FILTER_DEFAULTS } from "./filters"
import { useAdminAuth } from "@/contexts/admin-auth"
import { AlertBanner } from "../components/alert-banner"
import { AdminFilterField, AdminFilterSelect, AdminListFilters } from "../components/admin-list-filters"
import { AdminTable, adminActionsCol, adminBodyRow, adminHeadRow, adminTd, adminTh } from "../components/admin-table"
import { PageHeader } from "../components/page-header"
import { AppIcon } from "@/components/icons/app-icon"
import { RowActions } from "../components/row-actions"
import { adminMutation } from "@/lib/admin/admin-toast"
import { useAdminFilters } from "@/lib/admin/use-admin-filters"
import { formatLandpageSections, LANDPAGE_SECTIONS } from "@/lib/admin/landpage-sections"

export function SocialNetworksPageClient({ initialItems }: SocialNetworksPageClientProps) {
  const router = useRouter()
  const { canMutate, refreshAuth } = useAdminAuth()

  const { filters, setFilters, clearFilters } = useAdminFilters(FILTER_DEFAULTS)

  async function handleDelete(id: number) {
    if (!canMutate) return
    if (!window.confirm("Excluir esta rede social?")) return

    const data = await adminMutation(
      () => API.delete(`/admin/social_networks/${id}`),
      "Rede social excluída com sucesso.",
    )
    if (!data) return
    router.refresh()
    await refreshAuth()
  }

  return (
    <div>
      <PageHeader
        title="Redes sociais"
        description="Defina em quais seções da landpage cada link será exibido"
        icon={Share2}
        canMutate={canMutate}
        addHref="/admin/social-networks/new"
      />

      <div className="space-y-4 p-6 md:p-8">
        {!canMutate && (
          <AlertBanner
            variant="info"
            message="Faça login para criar, editar ou excluir redes sociais."
          />
        )}

        <AdminListFilters
          search={filters.q}
          onSearchSubmit={(q) => setFilters((current) => ({ ...current, q }))}
          onClear={clearFilters}
        >
          <AdminFilterField label="Seção">
            <AdminFilterSelect
              value={filters.position}
              onValueChange={(position) => setFilters((current) => ({ ...current, position }))}
              options={[
                { value: "", label: "Todas" },
                ...LANDPAGE_SECTIONS.map(({ id, label }) => ({ value: id, label })),
              ]}
            />
          </AdminFilterField>
        </AdminListFilters>

        {initialItems.length === 0 ? (
          <p className="text-sm text-zinc-500">Nenhuma rede social cadastrada.</p>
        ) : (
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
              {initialItems.map((item) => (
                <tr key={item.id} className={adminBodyRow}>
                  <td className={adminTd()}>
                    <AppIcon name={item.icon} className="size-4" />
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
                        editHref={`/admin/social-networks/${item.id}`}
                        onDelete={() => handleDelete(item.id)}
                      />
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </AdminTable>
        )}
      </div>
    </div>
  )
}

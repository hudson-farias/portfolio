"use client"

import { useRouter } from "next/navigation"

import { BadgeCheck } from "lucide-react"

import { API } from "@/api/client"
import type { AdminRole, RolesPageClientProps } from "./interfaces"
import { FILTER_DEFAULTS } from "./filters"
import { useAdminAuth } from "@/contexts/admin-auth"
import { AlertBanner } from "../components/alert-banner"
import { AdminFilterField, AdminFilterSelect, AdminListFilters } from "../components/admin-list-filters"
import { PageHeader } from "../components/page-header"
import { RowActions } from "../components/row-actions"
import { AdminTable, adminActionsCol, adminBodyRow, adminHeadRow, adminTd, adminTh } from "../components/admin-table"
import { adminMutation } from "@/lib/admin/admin-toast"
import { useAdminFilters } from "@/lib/admin/use-admin-filters"
import { AppIcon } from "@/components/icons/app-icon"

const BOOL_FILTER_OPTIONS = [
  { value: "", label: "Todos" },
  { value: "true", label: "Sim" },
  { value: "false", label: "Não" },
]

const SENIORITIES = [
  { value: "Junior", label: "Junior" },
  { value: "Pleno", label: "Pleno" },
  { value: "Senior", label: "Senior" },
  { value: "Lead", label: "Lead" },
]

function boolBadge(value: boolean, yes = "Sim", no = "Não") {
  return value ? (
    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200">
      {yes}
    </span>
  ) : (
    <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
      {no}
    </span>
  )
}

export function RolesPageClient({ initialItems }: RolesPageClientProps) {
  const router = useRouter()
  const { canMutate, refreshAuth } = useAdminAuth()

  const { filters, setFilters, clearFilters } = useAdminFilters(FILTER_DEFAULTS)

  async function handleDelete(id: number) {
    if (!canMutate) return
    if (!window.confirm("Excluir este cargo? Experiências vinculadas ficarão sem cargo.")) return

    const ok = await adminMutation(() => API.delete(`/admin/roles/${id}`), "Cargo excluído com sucesso.")
    if (!ok) return
    router.refresh()
    await refreshAuth()
  }

  return (
    <div>
      <PageHeader
        title="Cargos"
        description="Catálogo de cargos reutilizáveis em experiências e exibição pública"
        icon={BadgeCheck}
        canMutate={canMutate}
        addHref="/admin/roles/new"
      />

      <div className="space-y-4 p-6 md:p-8">
        {!canMutate && (
          <AlertBanner
            variant="info"
            message="Faça login para criar, editar ou excluir cargos."
          />
        )}

        <AdminListFilters
          search={filters.q}
          onSearchSubmit={(q) => setFilters((current) => ({ ...current, q }))}
          onClear={clearFilters}
        >
          <AdminFilterField label="Senioridade">
            <AdminFilterSelect
              value={filters.seniority}
              onValueChange={(seniority) => setFilters((current) => ({ ...current, seniority }))}
              options={[{ value: "", label: "Todas" }, ...SENIORITIES]}
            />
          </AdminFilterField>
          <AdminFilterField label="Exibir">
            <AdminFilterSelect
              value={filters.show}
              onValueChange={(show) => setFilters((current) => ({ ...current, show }))}
              options={BOOL_FILTER_OPTIONS}
            />
          </AdminFilterField>
          <AdminFilterField label="Ativo">
            <AdminFilterSelect
              value={filters.active}
              onValueChange={(active) => setFilters((current) => ({ ...current, active }))}
              options={BOOL_FILTER_OPTIONS}
            />
          </AdminFilterField>
          <AdminFilterField label="Destaque">
            <AdminFilterSelect
              value={filters.featured}
              onValueChange={(featured) => setFilters((current) => ({ ...current, featured }))}
              options={BOOL_FILTER_OPTIONS}
            />
          </AdminFilterField>
        </AdminListFilters>

        {initialItems.length === 0 ? (
          <p className="text-sm text-zinc-500">Nenhum cargo cadastrado.</p>
        ) : (
          <AdminTable scrollable>
            <thead>
              <tr className={adminHeadRow}>
                <th className={adminTh("min-w-48")}>Título</th>
                <th className={adminTh("w-32")}>Categoria</th>
                <th className={adminTh("w-28")}>Senioridade</th>
                <th className={adminTh("w-20")}>Exibir</th>
                <th className={adminTh("w-28")}>Experiências</th>
                <th className={adminTh("w-20")}>Ordem</th>
                {canMutate && <th className={adminTh(adminActionsCol)}>Ações</th>}
              </tr>
            </thead>
            <tbody>
              {initialItems.map((item) => (
                <tr key={item.id} className={adminBodyRow}>
                  <td className={adminTd()}>
                    <div className="flex items-center gap-2 font-medium">
                      {item.icon && <AppIcon name={item.icon} className="size-4" />}
                      {item.color && (
                        <span
                          className="size-3 rounded-full border border-zinc-300 dark:border-zinc-600"
                          style={{ backgroundColor: item.color }}
                        />
                      )}
                      {item.title}
                    </div>
                  </td>
                  <td className={adminTd("text-zinc-600 dark:text-zinc-400")}>{item.category ?? "—"}</td>
                  <td className={adminTd("text-zinc-600 dark:text-zinc-400")}>{item.seniority ?? "—"}</td>
                  <td className={adminTd()}>{boolBadge(item.show)}</td>
                  <td className={adminTd("text-zinc-500")}>{item.experience_count}</td>
                  <td className={adminTd("text-zinc-500")}>{item.sort_order}</td>
                  {canMutate && (
                    <td className={adminTd()}>
                      <RowActions
                        canMutate
                        editHref={`/admin/roles/${item.id}`}
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

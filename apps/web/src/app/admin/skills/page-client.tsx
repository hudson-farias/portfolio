"use client"

import { useRouter } from "next/navigation"

import { Layers } from "lucide-react"

import { API } from "@/api/client"
import type { SkillsPageClientProps } from "./interfaces"
import { FILTER_DEFAULTS } from "./filters"
import { useAdminAuth } from "@/contexts/admin-auth"
import { AlertBanner } from "../components/alert-banner"
import { AdminListFilters } from "../components/admin-list-filters"
import { PageHeader } from "../components/page-header"
import { AppIcon } from "@/components/icons/app-icon"
import { RowActions } from "../components/row-actions"
import { AdminTable, adminActionsCol, adminBodyRow, adminHeadRow, adminTd, adminTh } from "../components/admin-table"
import { adminMutation } from "@/lib/admin/admin-toast"
import { useAdminFilters } from "@/lib/admin/use-admin-filters"

export function SkillsPageClient({ initialData }: SkillsPageClientProps) {
  const router = useRouter()
  const { canMutate, refreshAuth } = useAdminAuth()

  const { filters, setFilters, clearFilters, queryString } = useAdminFilters(FILTER_DEFAULTS)

  async function handleDelete(id: number) {
    if (!canMutate) return
    if (!window.confirm("Excluir esta skill?")) return

    const ok = await adminMutation(() => API.delete(`/admin/skills/${id}`), "Skill excluída com sucesso.")
    if (!ok) return
    router.refresh()
    await refreshAuth()
  }

  const visibleSkills = queryString
    ? initialData.skills.filter((skill) => {
        const query = filters.q.trim().toLowerCase()
        return skill.name.toLowerCase().includes(query) || skill.icon.toLowerCase().includes(query)
      })
    : initialData.skills

  return (
    <div>
      <PageHeader
        title="Skills"
        description="Gerencie skills exibidas no stack e no currículo"
        icon={Layers}
        canMutate={canMutate}
        addHref="/admin/skills/new"
      />

      <div className="space-y-4 p-6 md:p-8">
        {!canMutate && (
          <AlertBanner variant="info" message="Faça login para criar, editar ou excluir skills." />
        )}

        <AdminListFilters
          search={filters.q}
          onSearchSubmit={(q) => setFilters((current) => ({ ...current, q }))}
          onClear={clearFilters}
        />

        {visibleSkills.length === 0 ? (
          <p className="text-sm text-zinc-500">Nenhuma skill encontrada.</p>
        ) : (
          <AdminTable>
            <thead>
              <tr className={adminHeadRow}>
                <th className={adminTh()}>Skill</th>
                {canMutate && <th className={adminTh(adminActionsCol)}>Ações</th>}
              </tr>
            </thead>
            <tbody>
              {visibleSkills.map((skill) => (
                <tr key={skill.id} className={adminBodyRow}>
                  <td className={adminTd()}>
                    <span className="inline-flex items-center gap-2.5 font-medium">
                      <AppIcon name={skill.icon} className="size-4 shrink-0" />
                      {skill.name}
                    </span>
                  </td>
                  {canMutate && (
                    <td className={adminTd()}>
                      <RowActions
                        canMutate
                        editHref={`/admin/skills/${skill.id}`}
                        onDelete={() => handleDelete(skill.id)}
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

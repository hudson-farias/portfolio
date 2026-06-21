"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

import { Briefcase } from "lucide-react"

import { API } from "@/api/client"
import type { AdminExperiences, ExperiencesPageClientProps } from "./interfaces"
import { FILTER_DEFAULTS } from "./filters"
import { useAdminAuth } from "@/contexts/admin-auth"
import { AlertBanner } from "../components/alert-banner"
import { AdminFilterField, AdminFilterSelect, AdminListFilters } from "../components/admin-list-filters"
import { PageHeader } from "../components/page-header"
import { ExperiencesTable } from "../components/experiences-table"
import { adminMutation } from "@/lib/admin/admin-toast"
import { useAdminFilters } from "@/lib/admin/use-admin-filters"

const BOOL_FILTER_OPTIONS = [
  { value: "", label: "Todas" },
  { value: "false", label: "Visíveis" },
  { value: "true", label: "Ocultas" },
]

const CONTRACT_TYPES = [
  { value: "CLT", label: "CLT" },
  { value: "PJ", label: "PJ" },
  { value: "FREELANCER", label: "Freelancer" },
]

const emptyData: AdminExperiences = { experiences: [], roles: [] }

export function ExperiencesPageClient({ initialData }: ExperiencesPageClientProps) {
  const router = useRouter()
  const { canMutate, refreshAuth } = useAdminAuth()
  const [data, setData] = useState(initialData ?? emptyData)

  useEffect(() => {
    if (initialData) setData(initialData)
  }, [initialData])

  const { experiences: initialItems, roles } = data

  const { filters, setFilters, clearFilters } = useAdminFilters(FILTER_DEFAULTS)

  async function handleDelete(id: number) {
    if (!canMutate) return
    if (!window.confirm("Excluir esta experiência?")) return

    const ok = await adminMutation(() => API.delete(`/admin/experiences/${id}`), "Experiência excluída com sucesso.")
    if (!ok) return
    router.refresh()
    await refreshAuth()
  }

  return (
    <div>
      <PageHeader
        title="Experiências"
        description="Gerencie os registros da tabela experiences"
        icon={Briefcase}
        canMutate={canMutate}
        addHref="/admin/experiences/new"
      />

      <div className="space-y-4 p-6 md:p-8">
        {!canMutate && (
          <AlertBanner
            variant="info"
            message="Faça login para criar, editar ou excluir experiências."
          />
        )}

        {roles.length === 0 && (
          <AlertBanner
            variant="info"
            message="Cadastre cargos em /admin/roles antes de vincular experiências."
          />
        )}

        <AdminListFilters
          search={filters.q}
          onSearchSubmit={(q) => setFilters((current) => ({ ...current, q }))}
          onClear={clearFilters}
        >
          <AdminFilterField label="Cargo">
            <AdminFilterSelect
              value={filters.role_id}
              onValueChange={(role_id) => setFilters((current) => ({ ...current, role_id }))}
              options={[
                { value: "", label: "Todos" },
                ...roles.map((role) => ({ value: String(role.id), label: role.title })),
              ]}
            />
          </AdminFilterField>
          <AdminFilterField label="Contrato">
            <AdminFilterSelect
              value={filters.contract_type}
              onValueChange={(contract_type) => setFilters((current) => ({ ...current, contract_type }))}
              options={[{ value: "", label: "Todos" }, ...CONTRACT_TYPES]}
            />
          </AdminFilterField>
          <AdminFilterField label="Status">
            <AdminFilterSelect
              value={filters.hidden}
              onValueChange={(hidden) => setFilters((current) => ({ ...current, hidden }))}
              options={BOOL_FILTER_OPTIONS}
            />
          </AdminFilterField>
        </AdminListFilters>

        {initialItems.length === 0 ? (
          <p className="text-sm text-zinc-500">Nenhuma experiência cadastrada.</p>
        ) : (
          <ExperiencesTable
            items={initialItems}
            canMutate={canMutate}
            getEditHref={(item) => `/admin/experiences/${item.id}`}
            onDelete={handleDelete}
          />
        )}
      </div>
    </div>
  )
}

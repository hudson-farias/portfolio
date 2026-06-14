"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

import { Briefcase } from "lucide-react"

import { API } from "@/api/client"
import type { AdminExperience, AdminExperiences, ContractType, ContractTypeOption, ExperienceForm, ExperiencesPageClientProps } from "./interfaces"
import { FILTER_DEFAULTS } from "./filters"
import { useAdminAuth } from "@/contexts/admin-auth"
import { AlertBanner } from "../components/alert-banner"
import { AdminFilterField, AdminFilterSelect, AdminListFilters } from "../components/admin-list-filters"
import { CheckboxField, Field, SelectInput, TextArea, TextInput } from "../components/form-fields"
import { FormModal } from "../components/form-modal"
import { PageHeader } from "../components/page-header"
import { ExperiencesTable } from "../components/experiences-table"
import { adminMutation } from "@/lib/admin/admin-toast"
import { useAdminFilters } from "@/lib/admin/use-admin-filters"

const BOOL_FILTER_OPTIONS = [
  { value: "", label: "Todas" },
  { value: "false", label: "Visíveis" },
  { value: "true", label: "Ocultas" },
]

const CONTRACT_TYPES: ContractTypeOption[] = [
  { value: "CLT", label: "CLT" },
  { value: "PJ", label: "PJ" },
  { value: "FREELANCER", label: "Freelancer" },
]

const emptyForm: ExperienceForm = {
  company: "",
  period: "",
  role_id: "",
  contract_type: "",
  description: "",
  hidden: false,
}

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
  const [modalOpen, setModalOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState(emptyForm)

  function openCreate() {
    setEditingId(null)
    setForm({
      ...emptyForm,
      role_id: roles[0] ? String(roles[0].id) : "",
    })
    setModalOpen(true)
  }

  function openEdit(item: AdminExperience) {
    setEditingId(item.id)
    setForm({
      company: item.company,
      period: item.period,
      role_id: item.role_id !== null ? String(item.role_id) : "",
      contract_type: item.contract_type ?? "",
      description: item.description,
      hidden: item.hidden ?? false,
    })
    setModalOpen(true)
  }

  function buildPayload() {
    return {
      company: form.company,
      period: form.period,
      role_id: form.role_id ? Number(form.role_id) : null,
      contract_type: form.contract_type ? (form.contract_type as ContractType) : null,
      description: form.description,
      hidden: form.hidden,
    }
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (!canMutate) return

    setSubmitting(true)
    const payload = buildPayload()
    const data = await adminMutation<AdminExperiences>(
      () =>
        editingId !== null
          ? API.put(`/admin/experiences/${editingId}`, payload)
          : API.post("/admin/experiences", payload),
      editingId !== null ? "Experiência atualizada com sucesso." : "Experiência criada com sucesso.",
    )
    if (!data) {
      setSubmitting(false)
      return
    }
    router.refresh()
    await refreshAuth()
    setModalOpen(false)
    setSubmitting(false)
  }

  async function handleDelete(id: number) {
    if (!canMutate) return
    if (!window.confirm("Excluir esta experiência?")) return

    const data = await adminMutation<AdminExperiences>(
      () => API.delete(`/admin/experiences/${id}`),
      "Experiência excluída com sucesso.",
    )
    if (!data) return
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
        onAdd={openCreate}
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
            onEdit={(item) => openEdit(item as AdminExperience)}
            onDelete={handleDelete}
          />
        )}
      </div>

      <FormModal
        open={modalOpen}
        title={editingId !== null ? "Editar experiência" : "Nova experiência"}
        submitting={submitting}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
      >
        <Field label="Empresa">
          <TextInput
            required
            value={form.company}
            onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))}
          />
        </Field>
        <Field label="Cargo">
          <SelectInput
            value={form.role_id}
            onChange={(e) => setForm((f) => ({ ...f, role_id: e.target.value }))}
          >
            <option value="">—</option>
            {roles
              .filter((role) => role.active)
              .map((role) => (
                <option key={role.id} value={role.id}>
                  {role.title} ({role.locale == null ? "Todos" : role.locale.toUpperCase()})
                </option>
              ))}
          </SelectInput>
        </Field>
        <Field label="Tipo de contrato">
          <SelectInput
            value={form.contract_type}
            onChange={(e) => setForm((f) => ({ ...f, contract_type: e.target.value }))}
          >
            <option value="">—</option>
            {CONTRACT_TYPES.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </SelectInput>
        </Field>
        <Field label="Período">
          <TextInput
            required
            placeholder="Ex: Jan 2023 — Atual"
            value={form.period}
            onChange={(e) => setForm((f) => ({ ...f, period: e.target.value }))}
          />
        </Field>
        <Field label="Descrição">
          <TextArea
            required
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          />
        </Field>
        <CheckboxField
          label="Ocultar (visível apenas com login no admin)"
          checked={form.hidden}
          onChange={(checked) => setForm((f) => ({ ...f, hidden: checked }))}
        />
      </FormModal>
    </div>
  )
}

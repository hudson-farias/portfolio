"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

import { Briefcase } from "lucide-react"

import { API } from "@/api/client"
import type { AdminExperience, AdminExperiences, ContractType, ContractTypeOption, ExperienceForm, ExperienceTranslationFields, ExperiencesPageClientProps } from "./interfaces"
import { FILTER_DEFAULTS } from "./filters"
import { useAdminAuth } from "@/contexts/admin-auth"
import { AlertBanner } from "../components/alert-banner"
import { AdminFilterField, AdminFilterSelect, AdminListFilters } from "../components/admin-list-filters"
import { CheckboxField, Field, SelectInput, TextArea, TextInput } from "../components/form-fields"
import { FormModal } from "../components/form-modal"
import { LocaleTabs } from "../components/locale-tabs"
import { PageHeader } from "../components/page-header"
import { ExperiencesTable } from "../components/experiences-table"
import { adminMutation } from "@/lib/admin/admin-toast"
import { useAdminFilters } from "@/lib/admin/use-admin-filters"
import { emptyTranslations, hasPendingEn, resolveTranslations, type LocaleCode } from "@/lib/admin/locale"

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

const TRANSLATION_KEYS: (keyof ExperienceTranslationFields)[] = ["period", "description"]

function emptyExperienceTranslationFields(): ExperienceTranslationFields {
  return { period: "", description: "" }
}

const emptyForm: ExperienceForm = {
  company: "",
  role_id: "",
  contract_type: "",
  live_url: "",
  hidden: false,
  translations: emptyTranslations(emptyExperienceTranslationFields),
}

const emptyData: AdminExperiences = { experiences: [], roles: [] }

function experienceToForm(item: AdminExperience): ExperienceForm {
  return {
    company: item.company,
    role_id: item.role_id !== null ? String(item.role_id) : "",
    contract_type: item.contract_type ?? "",
    live_url: item.live_url ?? "",
    hidden: item.hidden ?? false,
    translations: resolveTranslations(
      TRANSLATION_KEYS,
      item.translations?.pt ?? {},
      item.translations,
      emptyExperienceTranslationFields,
    ),
  }
}

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
  const [activeLocale, setActiveLocale] = useState<LocaleCode>("pt")
  const [form, setForm] = useState(emptyForm)

  function openCreate() {
    setEditingId(null)
    setActiveLocale("pt")
    setForm({
      ...emptyForm,
      role_id: roles[0] ? String(roles[0].id) : "",
    })
    setModalOpen(true)
  }

  function openEdit(item: AdminExperience) {
    setEditingId(item.id)
    setActiveLocale("pt")
    setForm(experienceToForm(item))
    setModalOpen(true)
  }

  function setTranslationField(key: keyof ExperienceTranslationFields, value: string) {
    setForm((current) => ({
      ...current,
      translations: {
        ...current.translations,
        [activeLocale]: { ...current.translations[activeLocale], [key]: value },
      },
    }))
  }

  function buildPayload() {
    const { translations, ...shared } = form
    return {
      ...shared,
      role_id: form.role_id ? Number(form.role_id) : null,
      contract_type: form.contract_type ? (form.contract_type as ContractType) : null,
      live_url: form.live_url.trim() || null,
      translations,
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

  const translationFields = form.translations[activeLocale]

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
        wide
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
                  {role.title}
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

        <div className="space-y-4 border-t border-zinc-200 pt-4 dark:border-zinc-800">
          <LocaleTabs
            active={activeLocale}
            onChange={setActiveLocale}
            enPending={hasPendingEn(form.translations, TRANSLATION_KEYS)}
          />
          <Field label="Período">
            <TextInput
              required={activeLocale === "pt"}
              placeholder="Ex: Jan 2023 — Atual"
              value={translationFields.period}
              onChange={(e) => setTranslationField("period", e.target.value)}
            />
          </Field>
          <Field label="Descrição">
            <TextArea
              required={activeLocale === "pt"}
              value={translationFields.description}
              onChange={(e) => setTranslationField("description", e.target.value)}
            />
          </Field>
        </div>

        <Field label="URL da empresa (opcional)">
          <TextInput
            type="url"
            placeholder="https://..."
            value={form.live_url}
            onChange={(e) => setForm((f) => ({ ...f, live_url: e.target.value }))}
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

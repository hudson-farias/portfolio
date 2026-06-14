"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

import { BadgeCheck } from "lucide-react"

import { API } from "@/api/client"
import type { AdminRole, LocaleOption, RoleForm, RoleSeniority, RolesPageClientProps, SeniorityOption } from "./interfaces"
import { FILTER_DEFAULTS } from "./filters"
import { useAdminAuth } from "@/contexts/admin-auth"
import { AlertBanner } from "../components/alert-banner"
import { AdminFilterField, AdminFilterSelect, AdminListFilters } from "../components/admin-list-filters"
import { CheckboxField, Field, SelectInput, TextArea, TextInput } from "../components/form-fields"
import { IconSelect } from "../components/icon-select"
import { FormModal } from "../components/form-modal"
import { PageHeader } from "../components/page-header"
import { RowActions } from "../components/row-actions"
import { AdminTable, adminActionsCol, adminBodyRow, adminHeadRow, adminTd, adminTh } from "../components/admin-table"
import { adminMutation } from "@/lib/admin/admin-toast"
import { useAdminFilters } from "@/lib/admin/use-admin-filters"
import { AppIcon } from "@/components/icons/app-icon"

const FILTER_LOCALES: LocaleOption[] = [
  { value: "", label: "Todos os locales" },
  { value: "pt", label: "PT" },
  { value: "en", label: "EN" },
  { value: "none", label: "Sem locale" },
]

const BOOL_FILTER_OPTIONS = [
  { value: "", label: "Todos" },
  { value: "true", label: "Sim" },
  { value: "false", label: "Não" },
]

const LOCALES: LocaleOption[] = [
  { value: "", label: "Todos" },
  { value: "pt", label: "PT" },
  { value: "en", label: "EN" },
]

function localeLabel(locale: string | null) {
  if (locale == null) return "Todos"
  return locale.toUpperCase()
}

const SENIORITIES: SeniorityOption[] = [
  { value: "Junior", label: "Junior" },
  { value: "Pleno", label: "Pleno" },
  { value: "Senior", label: "Senior" },
  { value: "Lead", label: "Lead" },
]

const emptyForm: RoleForm = {
  title: "",
  summary: "",
  category: "",
  seniority: "",
  show: false,
  featured: false,
  locale: "pt",
  active: true,
  sort_order: 0,
  color: "",
  icon: "",
}

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

function formToPayload(form: RoleForm) {
  return {
    title: form.title,
    summary: form.summary || null,
    category: form.category || null,
    seniority: form.seniority ? (form.seniority as RoleSeniority) : null,
    show: form.show,
    featured: form.featured,
    locale: form.locale || null,
    active: form.active,
    sort_order: form.sort_order,
    color: form.color || null,
    icon: form.icon || null,
  }
}

export function RolesPageClient({ initialItems }: RolesPageClientProps) {
  const router = useRouter()
  const { canMutate, refreshAuth } = useAdminAuth()

  const { filters, setFilters, clearFilters } = useAdminFilters(FILTER_DEFAULTS)
  const [modalOpen, setModalOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState(emptyForm)

  function openCreate() {
    setEditingId(null)
    setForm(emptyForm)
    setModalOpen(true)
  }

  function openEdit(item: AdminRole) {
    setEditingId(item.id)
    setForm({
      title: item.title,
      summary: item.summary ?? "",
      category: item.category ?? "",
      seniority: item.seniority ?? "",
      show: item.show,
      featured: item.featured,
      locale: item.locale ?? null,
      active: item.active,
      sort_order: item.sort_order,
      color: item.color ?? "",
      icon: item.icon ?? "",
    })
    setModalOpen(true)
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (!canMutate) return

    setSubmitting(true)
    const payload = formToPayload(form)
    const data = await adminMutation<AdminRole[]>(
      () =>
        editingId !== null
          ? API.put(`/admin/roles/${editingId}`, payload)
          : API.post("/admin/roles", payload),
      editingId !== null ? "Cargo atualizado com sucesso." : "Cargo criado com sucesso.",
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
    if (!window.confirm("Excluir este cargo? Experiências vinculadas ficarão sem cargo.")) return

    const data = await adminMutation<AdminRole[]>(
      () => API.delete(`/admin/roles/${id}`),
      "Cargo excluído com sucesso.",
    )
    if (!data) return
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
        onAdd={openCreate}
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
          <AdminFilterField label="Locale">
            <AdminFilterSelect
              value={filters.locale}
              onValueChange={(locale) => setFilters((current) => ({ ...current, locale }))}
              options={FILTER_LOCALES.map(({ value, label }) => ({ value: value ?? "", label }))}
            />
          </AdminFilterField>
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
                <th className={adminTh("w-24")}>Locale</th>
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
                  <td className={adminTd("text-zinc-500")}>{localeLabel(item.locale)}</td>
                  <td className={adminTd("text-zinc-600 dark:text-zinc-400")}>{item.category ?? "—"}</td>
                  <td className={adminTd("text-zinc-600 dark:text-zinc-400")}>{item.seniority ?? "—"}</td>
                  <td className={adminTd()}>{boolBadge(item.show)}</td>
                  <td className={adminTd("text-zinc-500")}>{item.experience_count}</td>
                  <td className={adminTd("text-zinc-500")}>{item.sort_order}</td>
                  {canMutate && (
                    <td className={adminTd()}>
                      <RowActions
                        canMutate
                        onEdit={() => openEdit(item)}
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

      <FormModal
        open={modalOpen}
        title={editingId !== null ? "Editar cargo" : "Novo cargo"}
        submitting={submitting}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
      >
        <Field label="Título">
          <TextInput
            required
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
          />
        </Field>
        <Field label="Locale">
          <SelectInput
            value={form.locale || ''}
            onChange={(e) => setForm((f) => ({ ...f, locale: e.target.value }))}
          >
            {LOCALES.map(({ value, label }) => (
              <option key={value || "all"} value={value || ''}>
                {label}
              </option>
            ))}
          </SelectInput>
        </Field>
        <Field label="Resumo">
          <TextArea
            value={form.summary}
            onChange={(e) => setForm((f) => ({ ...f, summary: e.target.value }))}
          />
        </Field>
        {/* <Field label="Categoria">
          <TextInput
            value={form.category}
            onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
          />
        </Field> */}
        <Field label="Senioridade">
          <SelectInput
            value={form.seniority}
            onChange={(e) => setForm((f) => ({ ...f, seniority: e.target.value }))}
          >
            <option value="">—</option>
            {SENIORITIES.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </SelectInput>
        </Field>
        <Field label="Ordem">
          <TextInput
            required
            type="number"
            min={0}
            value={form.sort_order}
            onChange={(e) => setForm((f) => ({ ...f, sort_order: Number(e.target.value) }))}
          />
        </Field>
        <Field label="Cor">
          <div className="flex gap-2">
            <TextInput
              type="color"
              className="h-10 w-14 shrink-0 cursor-pointer p-1"
              value={form.color || "#3b82f6"}
              onChange={(e) => setForm((f) => ({ ...f, color: e.target.value }))}
            />
            <TextInput
              placeholder="#3b82f6"
              value={form.color}
              onChange={(e) => setForm((f) => ({ ...f, color: e.target.value }))}
            />
          </div>
        </Field>
        <Field label="Ícone">
          <IconSelect
            value={form.icon}
            onChange={(icon) => setForm((f) => ({ ...f, icon }))}
          />
        </Field>
        <div className="flex flex-wrap gap-4">
          <CheckboxField
            label="Exibir no site"
            checked={form.show}
            onChange={(checked) => setForm((f) => ({ ...f, show: checked }))}
          />
          <CheckboxField
            label="Destaque"
            checked={form.featured}
            onChange={(checked) => setForm((f) => ({ ...f, featured: checked }))}
          />
          <CheckboxField
            label="Ativo"
            checked={form.active}
            onChange={(checked) => setForm((f) => ({ ...f, active: checked }))}
          />
        </div>
      </FormModal>
    </div>
  )
}

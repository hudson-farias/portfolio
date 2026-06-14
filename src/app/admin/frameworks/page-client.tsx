"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

import { Boxes, ChevronDown, ChevronUp } from "lucide-react"

import { API } from "@/api/client"
import type { AdminFramework, FrameworkForm, FrameworksPageClientProps } from "./interfaces"
import { FILTER_DEFAULTS } from "./filters"
import { useAdminAuth } from "@/contexts/admin-auth"
import { AlertBanner } from "../components/alert-banner"
import { AdminListFilters } from "../components/admin-list-filters"
import { AdminTable, adminActionsCol, adminBodyRow, adminHeadRow, adminTd, adminTh } from "../components/admin-table"
import { Field, SelectInput, TextInput } from "../components/form-fields"
import { IconSelect } from "../components/icon-select"
import { FormModal } from "../components/form-modal"
import { PageHeader } from "../components/page-header"
import { AppIcon } from "@/components/icons/app-icon"
import { skillIconNames } from "@/components/icons/map"
import { RowActions } from "../components/row-actions"
import { Button } from "@/components/ui/button"
import { adminMutation } from "@/lib/admin/admin-toast"
import { useAdminFilters } from "@/lib/admin/use-admin-filters"

const emptyForm: FrameworkForm = {
  name: "",
  icon: "",
  scope: "",
  language_ids: [],
}

function formToPayload(form: FrameworkForm) {
  return {
    name: form.name,
    icon: form.icon,
    scope: form.scope || null,
    language_ids: form.language_ids,
  }
}

function scopeLabel(scope: AdminFramework["scope"]) {
  if (scope === "backend") return "Backend"
  if (scope === "frontend") return "Frontend"
  return "—"
}

export function FrameworksPageClient({ initialItems, languages }: FrameworksPageClientProps) {
  const router = useRouter()
  const { canMutate, refreshAuth } = useAdminAuth()

  const { filters, setFilters, clearFilters } = useAdminFilters(FILTER_DEFAULTS)
  const [items, setItems] = useState(initialItems)
  const [modalOpen, setModalOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [reordering, setReordering] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState(emptyForm)

  const reorderDisabled = Boolean(filters.q)

  useEffect(() => {
    setItems(initialItems)
  }, [initialItems])

  function openCreate() {
    setEditingId(null)
    setForm(emptyForm)
    setModalOpen(true)
  }

  function openEdit(item: AdminFramework) {
    setEditingId(item.id)
    setForm({
      name: item.name,
      icon: item.icon,
      scope: item.scope ?? "",
      language_ids: item.languages.map((language) => language.id),
    })
    setModalOpen(true)
  }

  function toggleLanguage(languageId: number) {
    setForm((current) => ({
      ...current,
      language_ids: current.language_ids.includes(languageId)
        ? current.language_ids.filter((id) => id !== languageId)
        : [...current.language_ids, languageId],
    }))
  }

  async function persistOrder(nextItems: AdminFramework[]) {
    if (!canMutate || reorderDisabled) return

    setReordering(true)
    const data = await adminMutation<AdminFramework[]>(
      () => API.put("/admin/frameworks/reorder", { ids: nextItems.map((item) => item.id) }),
      "Ordem dos frameworks atualizada.",
    )
    setReordering(false)

    if (!data) return

    setItems(data)
    router.refresh()
    await refreshAuth()
  }

  async function moveItem(index: number, direction: -1 | 1) {
    const targetIndex = index + direction
    if (targetIndex < 0 || targetIndex >= items.length) return

    const nextItems = [...items]
    const [moved] = nextItems.splice(index, 1)
    nextItems.splice(targetIndex, 0, moved)
    setItems(nextItems)
    await persistOrder(nextItems)
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (!canMutate) return

    setSubmitting(true)
    const payload = formToPayload(form)
    const data = await adminMutation<AdminFramework[]>(
      () =>
        editingId !== null
          ? API.put(`/admin/frameworks/${editingId}`, payload)
          : API.post("/admin/frameworks", payload),
      editingId !== null ? "Framework atualizado com sucesso." : "Framework criado com sucesso.",
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
    if (!window.confirm("Excluir este framework?")) return

    const data = await adminMutation<AdminFramework[]>(
      () => API.delete(`/admin/frameworks/${id}`),
      "Framework excluído com sucesso.",
    )
    if (!data) return
    router.refresh()
    await refreshAuth()
  }

  return (
    <div>
      <PageHeader
        title="Frameworks"
        description="Frameworks exibidos em /frameworks, com vínculo às linguagens"
        icon={Boxes}
        canMutate={canMutate}
        onAdd={openCreate}
      />

      <div className="space-y-4 p-6 md:p-8">
        {!canMutate && (
          <AlertBanner variant="info" message="Faça login para criar, editar ou excluir frameworks." />
        )}

        {canMutate && reorderDisabled && (
          <AlertBanner variant="info" message="Limpe a busca para reordenar os frameworks pela posição na tabela." />
        )}

        <AdminListFilters
          search={filters.q}
          onSearchSubmit={(q) => setFilters((current) => ({ ...current, q }))}
          onClear={clearFilters}
        />

        {items.length === 0 ? (
          <p className="text-sm text-zinc-500">Nenhum framework cadastrado.</p>
        ) : (
          <AdminTable>
            <thead>
              <tr className={adminHeadRow}>
                {canMutate && !reorderDisabled && <th className={adminTh("w-20")}>Ordem</th>}
                <th className={adminTh()}>Framework</th>
                <th className={adminTh("w-28")}>Escopo</th>
                <th className={adminTh()}>Linguagens</th>
                {canMutate && <th className={adminTh(adminActionsCol)}>Ações</th>}
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={item.id} className={adminBodyRow}>
                  {canMutate && !reorderDisabled && (
                    <td className={adminTd()}>
                      <div className="flex items-center gap-1">
                        <span className="w-5 text-center text-xs text-zinc-500">{index + 1}</span>
                        <Button
                          type="button"
                          size="icon-xs"
                          variant="ghost"
                          aria-label={`Mover ${item.name} para cima`}
                          disabled={reordering || index === 0}
                          onClick={() => moveItem(index, -1)}
                        >
                          <ChevronUp className="size-3.5" />
                        </Button>
                        <Button
                          type="button"
                          size="icon-xs"
                          variant="ghost"
                          aria-label={`Mover ${item.name} para baixo`}
                          disabled={reordering || index === items.length - 1}
                          onClick={() => moveItem(index, 1)}
                        >
                          <ChevronDown className="size-3.5" />
                        </Button>
                      </div>
                    </td>
                  )}
                  <td className={adminTd()}>
                    <span className="inline-flex items-center gap-2.5 font-medium">
                      <AppIcon name={item.icon} className="size-4 shrink-0" />
                      {item.name}
                    </span>
                  </td>
                  <td className={adminTd("text-zinc-500")}>{scopeLabel(item.scope)}</td>
                  <td className={adminTd("text-zinc-500")}>
                    {item.languages.length > 0
                      ? item.languages.map((language) => language.name).join(", ")
                      : "—"}
                  </td>
                  {canMutate && (
                    <td className={adminTd()}>
                      <RowActions canMutate onEdit={() => openEdit(item)} onDelete={() => handleDelete(item.id)} />
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
        title={editingId !== null ? "Editar framework" : "Novo framework"}
        submitting={submitting}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
      >
        <Field label="Nome">
          <TextInput
            required
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          />
        </Field>
        <Field label="Escopo">
          <SelectInput
            value={form.scope}
            onChange={(e) => setForm((f) => ({ ...f, scope: e.target.value as FrameworkForm["scope"] }))}
          >
            <option value="">Nenhum</option>
            <option value="backend">Backend</option>
            <option value="frontend">Frontend</option>
          </SelectInput>
        </Field>
        <Field label="Ícone">
          <IconSelect
            required
            options={skillIconNames}
            value={form.icon}
            onChange={(icon) => setForm((f) => ({ ...f, icon }))}
          />
        </Field>
        <Field label="Linguagens vinculadas">
          {languages.length === 0 ? (
            <p className="text-sm text-zinc-500">Cadastre linguagens antes de vincular frameworks.</p>
          ) : (
            <div className="grid max-h-48 gap-2 overflow-y-auto rounded-lg border border-zinc-200 p-3 dark:border-zinc-700">
              {languages.map((language) => (
                <label key={language.id} className="flex cursor-pointer items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300">
                  <input
                    type="checkbox"
                    checked={form.language_ids.includes(language.id)}
                    onChange={() => toggleLanguage(language.id)}
                    className="size-4 rounded border-zinc-300 accent-zinc-900 dark:border-zinc-600 dark:accent-zinc-100"
                  />
                  <AppIcon name={language.icon} className="size-4 shrink-0" />
                  <span>{language.name}</span>
                </label>
              ))}
            </div>
          )}
        </Field>
      </FormModal>
    </div>
  )
}

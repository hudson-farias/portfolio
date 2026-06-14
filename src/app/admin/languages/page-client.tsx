"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

import { ChevronDown, ChevronUp, Languages } from "lucide-react"

import { API } from "@/api/client"
import type { AdminLanguage, LanguageForm, LanguagesPageClientProps } from "./interfaces"
import { FILTER_DEFAULTS } from "./filters"
import { useAdminAuth } from "@/contexts/admin-auth"
import { AlertBanner } from "../components/alert-banner"
import { AdminListFilters } from "../components/admin-list-filters"
import { AdminTable, adminActionsCol, adminBodyRow, adminHeadRow, adminTd, adminTh } from "../components/admin-table"
import { Field, TextInput } from "../components/form-fields"
import { IconSelect } from "../components/icon-select"
import { FormModal } from "../components/form-modal"
import { PageHeader } from "../components/page-header"
import { AppIcon } from "@/components/icons/app-icon"
import { languageIconNames } from "@/components/icons/map"
import { RowActions } from "../components/row-actions"
import { Button } from "@/components/ui/button"
import { adminMutation } from "@/lib/admin/admin-toast"
import { useAdminFilters } from "@/lib/admin/use-admin-filters"

const emptyForm: LanguageForm = {
  name: "",
  icon: "",
}

export function LanguagesPageClient({ initialItems }: LanguagesPageClientProps) {
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

  function openEdit(item: AdminLanguage) {
    setEditingId(item.id)
    setForm({
      name: item.name,
      icon: item.icon,
    })
    setModalOpen(true)
  }

  async function persistOrder(nextItems: AdminLanguage[]) {
    if (!canMutate || reorderDisabled) return

    setReordering(true)
    const data = await adminMutation<AdminLanguage[]>(
      () => API.put("/admin/languages/reorder", { ids: nextItems.map((item) => item.id) }),
      "Ordem das linguagens atualizada.",
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
    const data = await adminMutation<AdminLanguage[]>(
      () =>
        editingId !== null
          ? API.put(`/admin/languages/${editingId}`, form)
          : API.post("/admin/languages", form),
      editingId !== null ? "Linguagem atualizada com sucesso." : "Linguagem criada com sucesso.",
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
    if (!window.confirm("Excluir esta linguagem?")) return

    const data = await adminMutation<AdminLanguage[]>(
      () => API.delete(`/admin/languages/${id}`),
      "Linguagem excluída com sucesso.",
    )
    if (!data) return
    router.refresh()
    await refreshAuth()
  }

  return (
    <div>
      <PageHeader
        title="Linguagens"
        description="Linguagens vinculadas aos frameworks"
        icon={Languages}
        canMutate={canMutate}
        onAdd={openCreate}
      />

      <div className="space-y-4 p-6 md:p-8">
        {!canMutate && (
          <AlertBanner variant="info" message="Faça login para criar, editar ou excluir linguagens." />
        )}

        {canMutate && reorderDisabled && (
          <AlertBanner variant="info" message="Limpe a busca para reordenar as linguagens pela posição na tabela." />
        )}

        <AdminListFilters
          search={filters.q}
          onSearchSubmit={(q) => setFilters((current) => ({ ...current, q }))}
          onClear={clearFilters}
        />

        {items.length === 0 ? (
          <p className="text-sm text-zinc-500">Nenhuma linguagem cadastrada.</p>
        ) : (
          <AdminTable>
            <thead>
              <tr className={adminHeadRow}>
                {canMutate && !reorderDisabled && <th className={adminTh("w-20")}>Ordem</th>}
                <th className={adminTh()}>Linguagem</th>
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
        title={editingId !== null ? "Editar linguagem" : "Nova linguagem"}
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
        <Field label="Ícone">
          <IconSelect
            required
            options={languageIconNames}
            value={form.icon}
            onChange={(icon) => setForm((f) => ({ ...f, icon }))}
          />
        </Field>
      </FormModal>
    </div>
  )
}

"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

import { ChevronDown, ChevronUp, Wrench } from "lucide-react"

import { API } from "@/api/client"
import type { AdminTool, ToolForm, ToolsPageClientProps } from "./interfaces"
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
import { toolIconNames } from "@/components/icons/map"
import { RowActions } from "../components/row-actions"
import { Button } from "@/components/ui/button"
import { adminMutation } from "@/lib/admin/admin-toast"
import { useAdminFilters } from "@/lib/admin/use-admin-filters"

const emptyForm: ToolForm = {
  name: "",
  icon: "",
  url: "",
}

function formToPayload(form: ToolForm) {
  return {
    name: form.name,
    icon: form.icon,
    url: form.url.trim() || null,
  }
}

export function ToolsPageClient({ initialItems }: ToolsPageClientProps) {
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

  function openEdit(item: AdminTool) {
    setEditingId(item.id)
    setForm({
      name: item.name,
      icon: item.icon,
      url: item.url ?? "",
    })
    setModalOpen(true)
  }

  async function persistOrder(nextItems: AdminTool[]) {
    if (!canMutate || reorderDisabled) return

    setReordering(true)
    const data = await adminMutation<AdminTool[]>(
      () => API.put("/admin/tools/reorder", { ids: nextItems.map((item) => item.id) }),
      "Ordem das ferramentas atualizada.",
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
    const data = await adminMutation<AdminTool[]>(
      () =>
        editingId !== null
          ? API.put(`/admin/tools/${editingId}`, payload)
          : API.post("/admin/tools", payload),
      editingId !== null ? "Ferramenta atualizada com sucesso." : "Ferramenta criada com sucesso.",
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
    if (!window.confirm("Excluir esta ferramenta?")) return

    const data = await adminMutation<AdminTool[]>(
      () => API.delete(`/admin/tools/${id}`),
      "Ferramenta excluída com sucesso.",
    )
    if (!data) return
    router.refresh()
    await refreshAuth()
  }

  return (
    <div>
      <PageHeader
        title="Ferramentas"
        description="Ferramentas que você usa no dia a dia"
        icon={Wrench}
        canMutate={canMutate}
        onAdd={openCreate}
      />

      <div className="space-y-4 p-6 md:p-8">
        {!canMutate && (
          <AlertBanner
            variant="info"
            message="Faça login para criar, editar ou excluir ferramentas."
          />
        )}

        {canMutate && reorderDisabled && (
          <AlertBanner
            variant="info"
            message="Limpe a busca para reordenar as ferramentas pela posição na tabela."
          />
        )}

        <AdminListFilters
          search={filters.q}
          onSearchSubmit={(q) => setFilters((current) => ({ ...current, q }))}
          onClear={clearFilters}
        />

        {items.length === 0 ? (
          <p className="text-sm text-zinc-500">Nenhuma ferramenta cadastrada.</p>
        ) : (
          <AdminTable>
            <thead>
              <tr className={adminHeadRow}>
                {canMutate && !reorderDisabled && <th className={adminTh("w-20")}>Ordem</th>}
                <th className={adminTh()}>Ferramenta</th>
                <th className={adminTh()}>URL</th>
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
                  <td className={adminTd()}>
                    {item.url ? (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="break-all text-zinc-600 underline-offset-4 hover:underline dark:text-zinc-400"
                      >
                        {item.url}
                      </a>
                    ) : (
                      <span className="text-zinc-500">—</span>
                    )}
                  </td>
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
        title={editingId !== null ? "Editar ferramenta" : "Nova ferramenta"}
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
        <Field label="URL">
          <TextInput
            type="url"
            placeholder="https://..."
            value={form.url}
            onChange={(e) => setForm((f) => ({ ...f, url: e.target.value }))}
          />
        </Field>
        <Field label="Ícone">
          <IconSelect
            required
            options={toolIconNames}
            value={form.icon}
            onChange={(icon) => setForm((f) => ({ ...f, icon }))}
          />
        </Field>
      </FormModal>
    </div>
  )
}

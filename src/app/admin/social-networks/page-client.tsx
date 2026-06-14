"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

import { Share2 } from "lucide-react"

import { API } from "@/api/client"
import type { AdminSocialNetwork, SocialNetworkForm, SocialNetworksPageClientProps } from "./interfaces"
import { FILTER_DEFAULTS } from "./filters"
import { useAdminAuth } from "@/contexts/admin-auth"
import { AlertBanner } from "../components/alert-banner"
import { AdminFilterField, AdminFilterSelect, AdminListFilters } from "../components/admin-list-filters"
import { AdminTable, adminActionsCol, adminBodyRow, adminHeadRow, adminTd, adminTh } from "../components/admin-table"
import { CheckboxField, Field, SelectInput, TextInput } from "../components/form-fields"
import { IconSelect } from "../components/icon-select"
import { FormModal } from "../components/form-modal"
import { PageHeader } from "../components/page-header"
import { AppIcon } from "@/components/icons/app-icon"
import { adminSocialIconNames } from "@/components/icons/map"
import { RowActions } from "../components/row-actions"
import { adminMutation, adminToast } from "@/lib/admin/admin-toast"
import { useAdminFilters } from "@/lib/admin/use-admin-filters"
import { formatLandpageSections, LANDPAGE_SECTIONS } from "@/lib/admin/landpage-sections"

const emptyForm: SocialNetworkForm = {
  url: "",
  icon: "",
  positions: [],
}

export function SocialNetworksPageClient({ initialItems }: SocialNetworksPageClientProps) {
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

  function openEdit(item: AdminSocialNetwork) {
    setEditingId(item.id)
    setForm({
      url: item.url,
      icon: item.icon,
      positions: item.positions,
    })
    setModalOpen(true)
  }

  function togglePosition(position: string, checked: boolean) {
    setForm((current) => ({
      ...current,
      positions: checked
        ? [...current.positions, position]
        : current.positions.filter((item) => item !== position),
    }))
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (!canMutate) return
    if (form.positions.length === 0) {
      adminToast.error("Selecione pelo menos uma seção da landpage.")
      return
    }

    setSubmitting(true)
    const data = await adminMutation<AdminSocialNetwork[]>(
      () =>
        editingId !== null
          ? API.put(`/admin/social_networks/${editingId}`, form)
          : API.post("/admin/social_networks", form),
      editingId !== null ? "Rede social atualizada com sucesso." : "Rede social criada com sucesso.",
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
    if (!window.confirm("Excluir esta rede social?")) return

    const data = await adminMutation<AdminSocialNetwork[]>(
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
        onAdd={openCreate}
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
        title={editingId !== null ? "Editar rede social" : "Nova rede social"}
        submitting={submitting}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
      >
        <Field label="URL">
          <TextInput
            required
            type="url"
            placeholder="https://..."
            value={form.url}
            onChange={(e) => setForm((f) => ({ ...f, url: e.target.value }))}
          />
        </Field>
        <Field label="Ícone">
          <IconSelect
            required
            options={adminSocialIconNames}
            value={form.icon}
            onChange={(icon) => setForm((f) => ({ ...f, icon }))}
          />
        </Field>
        <Field label="Seções da landpage">
          <div className="flex flex-col gap-3 rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
            {LANDPAGE_SECTIONS.map(({ id, label }) => (
              <CheckboxField
                key={id}
                label={label}
                checked={form.positions.includes(id)}
                onChange={(checked) => togglePosition(id, checked)}
              />
            ))}
          </div>
        </Field>
      </FormModal>
    </div>
  )
}

"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

import { Layers } from "lucide-react"

import { API } from "@/api/client"
import type { AdminSkill, SkillForm, SkillsPageClientProps } from "./interfaces"
import { FILTER_DEFAULTS } from "./filters"
import { useAdminAuth } from "@/contexts/admin-auth"
import { AlertBanner } from "../components/alert-banner"
import { AdminListFilters } from "../components/admin-list-filters"
import { Field } from "../components/form-fields"
import { FormModal } from "../components/form-modal"
import { PageHeader } from "../components/page-header"
import { AppIcon } from "@/components/icons/app-icon"
import { skillIconNames } from "@/components/icons/map"
import { IconSelect } from "../components/icon-select"
import { RowActions } from "../components/row-actions"
import { AdminTable, adminActionsCol, adminBodyRow, adminHeadRow, adminTd, adminTh } from "../components/admin-table"
import { adminMutation } from "@/lib/admin/admin-toast"
import { useAdminFilters } from "@/lib/admin/use-admin-filters"
import { TextInput } from "../components/form-fields"

const emptyForm: SkillForm = {
  name: "",
  icon: "",
}

export function SkillsPageClient({ initialData }: SkillsPageClientProps) {
  const router = useRouter()
  const { canMutate, refreshAuth } = useAdminAuth()

  const { filters, setFilters, clearFilters, queryString } = useAdminFilters(FILTER_DEFAULTS)
  const [modalOpen, setModalOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState(emptyForm)

  function openCreate() {
    setEditingId(null)
    setForm(emptyForm)
    setModalOpen(true)
  }

  function openEdit(item: AdminSkill) {
    setEditingId(item.id)
    setForm({
      name: item.name,
      icon: item.icon,
    })
    setModalOpen(true)
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (!canMutate) return

    setSubmitting(true)
    const next = await adminMutation<SkillsPageClientProps["initialData"]>(
      () =>
        editingId !== null
          ? API.put(`/admin/skills/${editingId}`, form)
          : API.post("/admin/skills", form),
      editingId !== null ? "Skill atualizada com sucesso." : "Skill criada com sucesso.",
    )
    if (!next) {
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
    if (!window.confirm("Excluir esta skill?")) return

    const next = await adminMutation<SkillsPageClientProps["initialData"]>(() => API.delete(`/admin/skills/${id}`), "Skill excluída com sucesso.")
    if (!next) return
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
        onAdd={openCreate}
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
                        onEdit={() => openEdit(skill)}
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

      <FormModal
        open={modalOpen}
        title={editingId !== null ? "Editar skill" : "Nova skill"}
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
            options={skillIconNames}
            value={form.icon}
            onChange={(icon) => setForm((f) => ({ ...f, icon }))}
          />
        </Field>
      </FormModal>
    </div>
  )
}

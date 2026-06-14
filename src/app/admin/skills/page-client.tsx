"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

import { Layers } from "lucide-react"

import { API } from "@/api/client"
import type { AdminSkill, SkillForm, SkillsPageClientProps } from "./interfaces"
import { FILTER_DEFAULTS } from "./filters"
import { useAdminAuth } from "@/contexts/admin-auth"
import { AlertBanner } from "../components/alert-banner"
import { AdminFilterField, AdminFilterSelect, AdminListFilters } from "../components/admin-list-filters"
import { Field, SelectInput, TextInput } from "../components/form-fields"
import { FormModal } from "../components/form-modal"
import { PageHeader } from "../components/page-header"
import { AppIcon } from "@/components/icons/app-icon"
import { skillIconNames } from "@/components/icons/map"
import { IconSelect } from "../components/icon-select"
import { RowActions } from "../components/row-actions"
import { AdminTable, adminActionsCol, adminBodyRow, adminHeadRow, adminTd, adminTh } from "../components/admin-table"
import { adminMutation } from "@/lib/admin/admin-toast"
import { useAdminFilters } from "@/lib/admin/use-admin-filters"

const emptyForm: SkillForm = {
  name: "",
  icon: "",
  skill_category_id: 0,
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
    setForm({
      ...emptyForm,
      skill_category_id: initialData.categories[0]?.id ?? 0,
    })
    setModalOpen(true)
  }

  function openEdit(item: AdminSkill) {
    setEditingId(item.id)
    setForm({
      name: item.name,
      icon: item.icon,
      skill_category_id: item.skill_category_id,
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

  const skillsByCategory = initialData.categories.map((category) => ({
    category,
    skills: initialData.skills.filter((skill) => skill.skill_category_id === category.id),
  }))

  const visibleSkills = queryString ? initialData.skills : skillsByCategory.flatMap(({ skills }) => skills)

  return (
    <div>
      <PageHeader
        title="Skills"
        description="Gerencie habilidades e categorias"
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
        >
          <AdminFilterField label="Categoria">
            <AdminFilterSelect
              value={filters.skill_category_id}
              onValueChange={(skill_category_id) => setFilters((current) => ({ ...current, skill_category_id }))}
              options={[
                { value: "", label: "Todas" },
                ...initialData.categories.map((category) => ({
                  value: String(category.id),
                  label: category.title,
                })),
              ]}
            />
          </AdminFilterField>
        </AdminListFilters>

        {visibleSkills.length === 0 ? (
          <p className="text-sm text-zinc-500">Nenhuma skill encontrada.</p>
        ) : (
          <AdminTable>
            <thead>
              <tr className={adminHeadRow}>
                <th className={adminTh()}>Skill</th>
                <th className={adminTh("w-48")}>Categoria</th>
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
                  <td className={adminTd("text-zinc-500")}>{skill.skill_category_name}</td>
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
        <Field label="Categoria">
          <SelectInput
            required
            value={form.skill_category_id}
            onChange={(e) =>
              setForm((f) => ({ ...f, skill_category_id: Number(e.target.value) }))
            }
          >
            {initialData.categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.title}
              </option>
            ))}
          </SelectInput>
        </Field>
      </FormModal>
    </div>
  )
}

"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

import { API } from "@/api/client"
import type { RoleForm, RoleSeniority, RoleTranslationFields, SeniorityOption } from "./interfaces"
import { useAdminAuth } from "@/contexts/admin-auth"
import { AlertBanner } from "../components/alert-banner"
import { FormPageLayout } from "../components/form-page-layout"
import { CheckboxField, Field, SelectInput, TextArea, TextInput } from "../components/form-fields"
import { IconSelect } from "../components/icon-select"
import { LocaleTabs } from "../components/locale-tabs"
import { roleIconNames } from "@/components/icons/map"
import { adminMutation } from "@/lib/admin/admin-toast"
import { emptyTranslations, hasPendingEn, type LocaleCode } from "@/lib/admin/locale"

const SENIORITIES: SeniorityOption[] = [
  { value: "Junior", label: "Junior" },
  { value: "Pleno", label: "Pleno" },
  { value: "Senior", label: "Senior" },
  { value: "Lead", label: "Lead" },
]

const TRANSLATION_KEYS: (keyof RoleTranslationFields)[] = ["title", "summary"]

function emptyRoleTranslationFields(): RoleTranslationFields {
  return { title: "", summary: "" }
}

export const emptyRoleForm: RoleForm = {
  category: "",
  seniority: "",
  show: false,
  featured: false,
  active: true,
  sort_order: 0,
  color: "",
  icon: "",
  translations: emptyTranslations(emptyRoleTranslationFields),
}

function formToPayload(form: RoleForm) {
  const { translations, ...shared } = form
  return {
    ...shared,
    category: form.category || null,
    seniority: form.seniority ? (form.seniority as RoleSeniority) : null,
    color: form.color || null,
    icon: form.icon || null,
    translations,
  }
}

export const RolesFormClient = ({ mode, roleId, initialForm }: { mode: "create" | "edit"; roleId?: number; initialForm: RoleForm }) => {
  const router = useRouter()
  const { canMutate, refreshAuth } = useAdminAuth()
  const [submitting, setSubmitting] = useState(false)
  const [activeLocale, setActiveLocale] = useState<LocaleCode>("pt")
  const [form, setForm] = useState(initialForm)

  function setTranslationField(key: keyof RoleTranslationFields, value: string) {
    setForm((current) => ({
      ...current,
      translations: {
        ...current.translations,
        [activeLocale]: { ...current.translations[activeLocale], [key]: value },
      },
    }))
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (!canMutate) return

    setSubmitting(true)
    const payload = formToPayload(form)
    const ok = await adminMutation(
      () =>
        mode === "edit" && roleId !== undefined
          ? API.put(`/admin/roles/${roleId}`, payload)
          : API.post("/admin/roles", payload),
      mode === "edit" ? "Cargo atualizado com sucesso." : "Cargo criado com sucesso.",
    )
    if (!ok) {
      setSubmitting(false)
      return
    }
    await refreshAuth()
    router.push("/admin/roles")
    router.refresh()
  }

  const translationFields = form.translations[activeLocale]

  return (
    <>
      {!canMutate && (
        <AlertBanner variant="info" message="Faça login para editar cargos." />
      )}

      <FormPageLayout
        backHref="/admin/roles"
        backLabel="Voltar para cargos"
        title={mode === "edit" ? "Editar cargo" : "Novo cargo"}
        canMutate={canMutate}
        submitting={submitting}
        onSubmit={handleSubmit}
      >
        <div className="space-y-4">
          <LocaleTabs
            active={activeLocale}
            onChange={setActiveLocale}
            enPending={hasPendingEn(form.translations, TRANSLATION_KEYS)}
          />
          <Field label="Título">
            <TextInput
              required={activeLocale === "pt"}
              disabled={!canMutate}
              value={translationFields.title}
              onChange={(e) => setTranslationField("title", e.target.value)}
            />
          </Field>
          <Field label="Resumo">
            <TextArea
              disabled={!canMutate}
              value={translationFields.summary}
              onChange={(e) => setTranslationField("summary", e.target.value)}
            />
          </Field>
        </div>
        <Field label="Senioridade">
          <SelectInput
            disabled={!canMutate}
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
            disabled={!canMutate}
            type="number"
            min={0}
            value={form.sort_order}
            onChange={(e) => setForm((f) => ({ ...f, sort_order: Number(e.target.value) }))}
          />
        </Field>
        <Field label="Cor">
          <div className="flex gap-2">
            <TextInput
              disabled={!canMutate}
              type="color"
              className="h-10 w-14 shrink-0 cursor-pointer p-1"
              value={form.color || "#3b82f6"}
              onChange={(e) => setForm((f) => ({ ...f, color: e.target.value }))}
            />
            <TextInput
              disabled={!canMutate}
              placeholder="#3b82f6"
              value={form.color}
              onChange={(e) => setForm((f) => ({ ...f, color: e.target.value }))}
            />
          </div>
        </Field>
        <Field label="Ícone">
          <IconSelect
            options={roleIconNames}
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
      </FormPageLayout>
    </>
  )
}

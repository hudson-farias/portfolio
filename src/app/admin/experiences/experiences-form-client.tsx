"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

import { API } from "@/api/client"
import type { ContractType, ContractTypeOption, ExperienceForm, ExperienceRole, ExperienceTranslationFields } from "./interfaces"
import { useAdminAuth } from "@/contexts/admin-auth"
import { AlertBanner } from "../components/alert-banner"
import { FormPageLayout } from "../components/form-page-layout"
import { CheckboxField, Field, SelectInput, TextArea, TextInput } from "../components/form-fields"
import { LocaleTabs } from "../components/locale-tabs"
import { adminMutation } from "@/lib/admin/admin-toast"
import { emptyTranslations, hasPendingEn, type LocaleCode } from "@/lib/admin/locale"

const CONTRACT_TYPES: ContractTypeOption[] = [
  { value: "CLT", label: "CLT" },
  { value: "PJ", label: "PJ" },
  { value: "FREELANCER", label: "Freelancer" },
]

const TRANSLATION_KEYS: (keyof ExperienceTranslationFields)[] = ["period", "description"]

function emptyExperienceTranslationFields(): ExperienceTranslationFields {
  return { period: "", description: "" }
}

export function emptyExperienceForm(defaultRoleId = ""): ExperienceForm {
  return {
    company: "",
    role_id: defaultRoleId,
    contract_type: "",
    live_url: "",
    hidden: false,
    translations: emptyTranslations(emptyExperienceTranslationFields),
  }
}

function buildPayload(form: ExperienceForm) {
  const { translations, ...shared } = form
  return {
    ...shared,
    role_id: form.role_id ? Number(form.role_id) : null,
    contract_type: form.contract_type ? (form.contract_type as ContractType) : null,
    live_url: form.live_url.trim() || null,
    translations,
  }
}

export const ExperiencesFormClient = ({ mode, experienceId, initialForm, roles }: { mode: "create" | "edit"; experienceId?: number; initialForm: ExperienceForm; roles: ExperienceRole[] }) => {
  const router = useRouter()
  const { canMutate, refreshAuth } = useAdminAuth()
  const [submitting, setSubmitting] = useState(false)
  const [activeLocale, setActiveLocale] = useState<LocaleCode>("pt")
  const [form, setForm] = useState(initialForm)

  function setTranslationField(key: keyof ExperienceTranslationFields, value: string) {
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
    const payload = buildPayload(form)
    const ok = await adminMutation(
      () =>
        mode === "edit" && experienceId !== undefined
          ? API.put(`/admin/experiences/${experienceId}`, payload)
          : API.post("/admin/experiences", payload),
      mode === "edit" ? "Experiência atualizada com sucesso." : "Experiência criada com sucesso.",
    )
    if (!ok) {
      setSubmitting(false)
      return
    }
    await refreshAuth()
    router.push("/admin/experiences")
    router.refresh()
  }

  const translationFields = form.translations[activeLocale]

  return (
    <>
      {!canMutate && (
        <AlertBanner variant="info" message="Faça login para editar experiências." />
      )}

      {roles.length === 0 && (
        <AlertBanner
          variant="info"
          message="Cadastre cargos em /admin/roles antes de vincular experiências."
        />
      )}

      <FormPageLayout
        backHref="/admin/experiences"
        backLabel="Voltar para experiências"
        title={mode === "edit" ? "Editar experiência" : "Nova experiência"}
        canMutate={canMutate}
        submitting={submitting}
        onSubmit={handleSubmit}
      >
        <Field label="Empresa">
          <TextInput
            required
            disabled={!canMutate}
            value={form.company}
            onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))}
          />
        </Field>
        <Field label="Cargo">
          <SelectInput
            disabled={!canMutate}
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
            disabled={!canMutate}
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
              disabled={!canMutate}
              placeholder="Ex: Jan 2023 — Atual"
              value={translationFields.period}
              onChange={(e) => setTranslationField("period", e.target.value)}
            />
          </Field>
          <Field label="Descrição">
            <TextArea
              required={activeLocale === "pt"}
              disabled={!canMutate}
              value={translationFields.description}
              onChange={(e) => setTranslationField("description", e.target.value)}
            />
          </Field>
        </div>

        <Field label="URL da empresa (opcional)">
          <TextInput
            disabled={!canMutate}
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
      </FormPageLayout>
    </>
  )
}

"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

import { API } from "@/api/client"
import type { FrameworkForm } from "./interfaces"
import type { AdminLanguage } from "../languages/interfaces"
import { useAdminAuth } from "@/contexts/admin-auth"
import { AlertBanner } from "../components/alert-banner"
import { FormPageLayout } from "../components/form-page-layout"
import { Field, SelectInput, TextInput } from "../components/form-fields"
import { IconSelect } from "../components/icon-select"
import { AppIcon } from "@/components/icons/app-icon"
import { adminMutation } from "@/lib/admin/admin-toast"
import { frameworkIconNames } from "@/components/icons/map"

function formToPayload(form: FrameworkForm) {
  return {
    name: form.name,
    icon: form.icon,
    scope: form.scope || null,
    language_ids: form.language_ids,
  }
}

export const FrameworksFormClient = ({ mode, frameworkId, initialForm, languages }: { mode: "create" | "edit"; frameworkId?: number; initialForm: FrameworkForm; languages: AdminLanguage[] }) => {
  const router = useRouter()
  const { canMutate, refreshAuth } = useAdminAuth()
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState(initialForm)

  function toggleLanguage(languageId: number) {
    setForm((current) => ({
      ...current,
      language_ids: current.language_ids.includes(languageId)
        ? current.language_ids.filter((id) => id !== languageId)
        : [...current.language_ids, languageId],
    }))
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (!canMutate) return

    setSubmitting(true)
    const payload = formToPayload(form)
    const ok = await adminMutation(
      () =>
        mode === "edit" && frameworkId !== undefined
          ? API.put(`/admin/frameworks/${frameworkId}`, payload)
          : API.post("/admin/frameworks", payload),
      mode === "edit" ? "Framework atualizado com sucesso." : "Framework criado com sucesso.",
    )
    if (!ok) {
      setSubmitting(false)
      return
    }
    await refreshAuth()
    router.push("/admin/frameworks")
    router.refresh()
  }

  return (
    <>
      {!canMutate && (
        <AlertBanner variant="info" message="Faça login para editar frameworks." />
      )}

      <FormPageLayout
        backHref="/admin/frameworks"
        backLabel="Voltar para frameworks"
        title={mode === "edit" ? "Editar framework" : "Novo framework"}
        canMutate={canMutate}
        submitting={submitting}
        onSubmit={handleSubmit}
      >
        <Field label="Nome">
          <TextInput
            required
            disabled={!canMutate}
            value={form.name}
            onChange={(e) => setForm((current) => ({ ...current, name: e.target.value }))}
          />
        </Field>
        <Field label="Escopo">
          <SelectInput
            disabled={!canMutate}
            value={form.scope}
            onChange={(e) => setForm((current) => ({ ...current, scope: e.target.value as FrameworkForm["scope"] }))}
          >
            <option value="">Nenhum</option>
            <option value="backend">Backend</option>
            <option value="frontend">Frontend</option>
          </SelectInput>
        </Field>
        <Field label="Ícone">
          <IconSelect
            required
            options={frameworkIconNames}
            value={form.icon}
            onChange={(icon) => setForm((current) => ({ ...current, icon }))}
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
                    disabled={!canMutate}
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
      </FormPageLayout>
    </>
  )
}

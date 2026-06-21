"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

import { API } from "@/api/client"
import type { LanguageForm } from "./interfaces"
import { useAdminAuth } from "@/contexts/admin-auth"
import { AlertBanner } from "../components/alert-banner"
import { FormPageLayout } from "../components/form-page-layout"
import { Field, TextInput } from "../components/form-fields"
import { IconSelect } from "../components/icon-select"
import { adminMutation } from "@/lib/admin/admin-toast"
import { languageIconNames } from "@/components/icons/map"

export const LanguagesFormClient = ({ mode, languageId, initialForm }: { mode: "create" | "edit"; languageId?: number; initialForm: LanguageForm }) => {
  const router = useRouter()
  const { canMutate, refreshAuth } = useAdminAuth()
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState(initialForm)

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (!canMutate) return

    setSubmitting(true)
    const ok = await adminMutation(
      () =>
        mode === "edit" && languageId !== undefined
          ? API.put(`/admin/languages/${languageId}`, form)
          : API.post("/admin/languages", form),
      mode === "edit" ? "Linguagem atualizada com sucesso." : "Linguagem criada com sucesso.",
    )
    if (!ok) {
      setSubmitting(false)
      return
    }
    await refreshAuth()
    router.push("/admin/languages")
    router.refresh()
  }

  return (
    <>
      {!canMutate && (
        <AlertBanner variant="info" message="Faça login para editar linguagens." />
      )}

      <FormPageLayout
        backHref="/admin/languages"
        backLabel="Voltar para linguagens"
        title={mode === "edit" ? "Editar linguagem" : "Nova linguagem"}
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
        <Field label="Ícone">
          <IconSelect
            required
            options={languageIconNames}
            value={form.icon}
            onChange={(icon) => setForm((current) => ({ ...current, icon }))}
          />
        </Field>
      </FormPageLayout>
    </>
  )
}

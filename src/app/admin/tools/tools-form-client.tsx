"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

import { API } from "@/api/client"
import type { ToolForm } from "./interfaces"
import { useAdminAuth } from "@/contexts/admin-auth"
import { AlertBanner } from "../components/alert-banner"
import { FormPageLayout } from "../components/form-page-layout"
import { Field, TextInput } from "../components/form-fields"
import { IconSelect } from "../components/icon-select"
import { adminMutation } from "@/lib/admin/admin-toast"
import { toolIconNames } from "@/components/icons/map"

function formToPayload(form: ToolForm) {
  return {
    name: form.name,
    icon: form.icon,
    url: form.url.trim() || null,
  }
}

export const ToolsFormClient = ({ mode, toolId, initialForm }: { mode: "create" | "edit"; toolId?: number; initialForm: ToolForm }) => {
  const router = useRouter()
  const { canMutate, refreshAuth } = useAdminAuth()
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState(initialForm)

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (!canMutate) return

    setSubmitting(true)
    const payload = formToPayload(form)
    const ok = await adminMutation(
      () =>
        mode === "edit" && toolId !== undefined
          ? API.put(`/admin/tools/${toolId}`, payload)
          : API.post("/admin/tools", payload),
      mode === "edit" ? "Ferramenta atualizada com sucesso." : "Ferramenta criada com sucesso.",
    )
    if (!ok) {
      setSubmitting(false)
      return
    }
    await refreshAuth()
    router.push("/admin/tools")
    router.refresh()
  }

  return (
    <>
      {!canMutate && (
        <AlertBanner variant="info" message="Faça login para editar ferramentas." />
      )}

      <FormPageLayout
        backHref="/admin/tools"
        backLabel="Voltar para ferramentas"
        title={mode === "edit" ? "Editar ferramenta" : "Nova ferramenta"}
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
        <Field label="URL">
          <TextInput
            type="url"
            placeholder="https://..."
            disabled={!canMutate}
            value={form.url}
            onChange={(e) => setForm((current) => ({ ...current, url: e.target.value }))}
          />
        </Field>
        <Field label="Ícone">
          <IconSelect
            required
            options={toolIconNames}
            value={form.icon}
            onChange={(icon) => setForm((current) => ({ ...current, icon }))}
          />
        </Field>
      </FormPageLayout>
    </>
  )
}

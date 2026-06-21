"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

import { API } from "@/api/client"
import type { DatabaseForm } from "./interfaces"
import { useAdminAuth } from "@/contexts/admin-auth"
import { AlertBanner } from "../components/alert-banner"
import { FormPageLayout } from "../components/form-page-layout"
import { Field, SelectInput, TextInput } from "../components/form-fields"
import { IconSelect } from "../components/icon-select"
import { adminMutation } from "@/lib/admin/admin-toast"
import { databaseIconNames } from "@/components/icons/map"

function formToPayload(form: DatabaseForm) {
  return {
    name: form.name,
    icon: form.icon,
    scope: form.scope || null,
  }
}

export const DatabasesFormClient = ({ mode, databaseId, initialForm }: { mode: "create" | "edit"; databaseId?: number; initialForm: DatabaseForm }) => {
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
        mode === "edit" && databaseId !== undefined
          ? API.put(`/admin/databases/${databaseId}`, payload)
          : API.post("/admin/databases", payload),
      mode === "edit" ? "Banco atualizado com sucesso." : "Banco criado com sucesso.",
    )
    if (!ok) {
      setSubmitting(false)
      return
    }
    await refreshAuth()
    router.push("/admin/databases")
    router.refresh()
  }

  return (
    <>
      {!canMutate && (
        <AlertBanner variant="info" message="Faça login para editar bancos de dados." />
      )}

      <FormPageLayout
        backHref="/admin/databases"
        backLabel="Voltar para bancos de dados"
        title={mode === "edit" ? "Editar banco" : "Novo banco"}
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
        <Field label="Tipo">
          <SelectInput
            disabled={!canMutate}
            value={form.scope}
            onChange={(e) => setForm((current) => ({ ...current, scope: e.target.value as DatabaseForm["scope"] }))}
          >
            <option value="">Nenhum</option>
            <option value="sql">SQL</option>
            <option value="nosql">NoSQL</option>
          </SelectInput>
        </Field>
        <Field label="Ícone">
          <IconSelect
            required
            options={databaseIconNames}
            value={form.icon}
            onChange={(icon) => setForm((current) => ({ ...current, icon }))}
          />
        </Field>
      </FormPageLayout>
    </>
  )
}

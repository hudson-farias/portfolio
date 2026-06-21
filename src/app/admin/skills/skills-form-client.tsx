"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

import { API } from "@/api/client"
import type { SkillForm } from "./interfaces"
import { useAdminAuth } from "@/contexts/admin-auth"
import { AlertBanner } from "../components/alert-banner"
import { FormPageLayout } from "../components/form-page-layout"
import { Field, TextInput } from "../components/form-fields"
import { IconSelect } from "../components/icon-select"
import { adminMutation } from "@/lib/admin/admin-toast"
import { skillIconNames } from "@/components/icons/map"

export const SkillsFormClient = ({ mode, skillId, initialForm }: { mode: "create" | "edit"; skillId?: number; initialForm: SkillForm }) => {
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
        mode === "edit" && skillId !== undefined
          ? API.put(`/admin/skills/${skillId}`, form)
          : API.post("/admin/skills", form),
      mode === "edit" ? "Skill atualizada com sucesso." : "Skill criada com sucesso.",
    )
    if (!ok) {
      setSubmitting(false)
      return
    }
    await refreshAuth()
    router.push("/admin/skills")
    router.refresh()
  }

  return (
    <>
      {!canMutate && (
        <AlertBanner variant="info" message="Faça login para editar skills." />
      )}

      <FormPageLayout
        backHref="/admin/skills"
        backLabel="Voltar para skills"
        title={mode === "edit" ? "Editar skill" : "Nova skill"}
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
            options={skillIconNames}
            value={form.icon}
            onChange={(icon) => setForm((current) => ({ ...current, icon }))}
          />
        </Field>
      </FormPageLayout>
    </>
  )
}

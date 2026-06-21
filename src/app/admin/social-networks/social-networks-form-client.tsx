"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

import { API } from "@/api/client"
import type { SocialNetworkForm } from "./interfaces"
import { useAdminAuth } from "@/contexts/admin-auth"
import { AlertBanner } from "../components/alert-banner"
import { FormPageLayout } from "../components/form-page-layout"
import { CheckboxField, Field, TextInput } from "../components/form-fields"
import { IconSelect } from "../components/icon-select"
import { adminMutation, adminToast } from "@/lib/admin/admin-toast"
import { adminSocialIconNames } from "@/components/icons/map"
import { LANDPAGE_SECTIONS } from "@/lib/admin/landpage-sections"

export const SocialNetworksFormClient = ({ mode, socialNetworkId, initialForm }: { mode: "create" | "edit"; socialNetworkId?: number; initialForm: SocialNetworkForm }) => {
  const router = useRouter()
  const { canMutate, refreshAuth } = useAdminAuth()
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState(initialForm)

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
    const ok = await adminMutation(
      () =>
        mode === "edit" && socialNetworkId !== undefined
          ? API.put(`/admin/social_networks/${socialNetworkId}`, form)
          : API.post("/admin/social_networks", form),
      mode === "edit" ? "Rede social atualizada com sucesso." : "Rede social criada com sucesso.",
    )
    if (!ok) {
      setSubmitting(false)
      return
    }
    await refreshAuth()
    router.push("/admin/social-networks")
    router.refresh()
  }

  return (
    <>
      {!canMutate && (
        <AlertBanner variant="info" message="Faça login para editar redes sociais." />
      )}

      <FormPageLayout
        backHref="/admin/social-networks"
        backLabel="Voltar para redes sociais"
        title={mode === "edit" ? "Editar rede social" : "Nova rede social"}
        canMutate={canMutate}
        submitting={submitting}
        onSubmit={handleSubmit}
      >
        <Field label="URL">
          <TextInput
            required
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
            options={adminSocialIconNames}
            value={form.icon}
            onChange={(icon) => setForm((current) => ({ ...current, icon }))}
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
      </FormPageLayout>
    </>
  )
}

"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

import { API } from "@/api/client"
import type { ProjectForm, ProjectTranslationFields } from "./interfaces"
import { useAdminAuth } from "@/contexts/admin-auth"
import { AlertBanner } from "../components/alert-banner"
import { FormPageLayout } from "../components/form-page-layout"
import { Field, TextArea, TextInput } from "../components/form-fields"
import { LocaleTabs } from "../components/locale-tabs"
import { adminMutation } from "@/lib/admin/admin-toast"
import { emptyTranslations, hasPendingEn, type LocaleCode } from "@/lib/admin/locale"

export type ProjectsFormMode = "create-github" | "create-external" | "edit"

const TRANSLATION_KEYS: (keyof ProjectTranslationFields)[] = ["title", "description"]

function emptyProjectTranslationFields(): ProjectTranslationFields {
  return { title: "", description: "" }
}

export const emptyProjectForm: ProjectForm = {
  image_url: "",
  live_url: "",
  repo_url: "",
  translations: emptyTranslations(emptyProjectTranslationFields),
}

export function buildProjectPayload(form: ProjectForm, includeRepoUrl: boolean) {
  const { translations, ...shared } = form
  return {
    ...shared,
    image_url: form.image_url.trim() || null,
    live_url: form.live_url.trim() || null,
    translations,
    ...(includeRepoUrl ? { repo_url: form.repo_url.trim() || null } : {}),
  }
}

function formTitle(mode: ProjectsFormMode, gitId?: number) {
  if (mode === "create-external") return "Adicionar projeto externo"
  if (mode === "create-github") return "Adicionar projeto"
  if (gitId !== undefined && gitId < 0) return "Editar projeto externo"
  return "Editar projeto"
}

export const ProjectsFormClient = ({ mode, gitId, initialForm }: { mode: ProjectsFormMode; gitId?: number; initialForm: ProjectForm }) => {
  const router = useRouter()
  const { canMutate, refreshAuth } = useAdminAuth()
  const [submitting, setSubmitting] = useState(false)
  const [activeLocale, setActiveLocale] = useState<LocaleCode>("pt")
  const [form, setForm] = useState(initialForm)

  const showRepoUrlInput = mode === "create-external" || (mode === "edit" && gitId !== undefined && gitId < 0)
  const isCreate = mode === "create-github" || mode === "create-external"

  function setTranslationField(key: keyof ProjectTranslationFields, value: string) {
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

    if (mode === "create-github" && gitId === undefined) return
    if (mode === "edit" && gitId === undefined) return

    setSubmitting(true)
    const payload = buildProjectPayload(form, showRepoUrlInput)
    const ok = await adminMutation(
      () => {
        if (mode === "create-external") return API.post("/admin/projects/external", payload)
        if (mode === "create-github") return API.post(`/admin/projects/${gitId}`, payload)
        return API.put(`/admin/projects/${gitId}`, payload)
      },
      isCreate
        ? `"${payload.translations.pt.title}" adicionado ao portfólio.`
        : `"${payload.translations.pt.title}" atualizado com sucesso.`,
    )
    if (!ok) {
      setSubmitting(false)
      return
    }
    await refreshAuth()
    router.push("/admin/projects")
    router.refresh()
  }

  const translationFields = form.translations[activeLocale]

  return (
    <>
      {!canMutate && (
        <AlertBanner variant="info" message="Faça login para adicionar ou editar projetos." />
      )}

      <FormPageLayout
        backHref="/admin/projects"
        backLabel="Voltar para projetos"
        title={formTitle(mode, gitId)}
        canMutate={canMutate}
        submitting={submitting}
        submitLabel={isCreate ? "Adicionar" : "Salvar"}
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
          <Field label="Descrição">
            <TextArea
              disabled={!canMutate}
              value={translationFields.description}
              onChange={(e) => setTranslationField("description", e.target.value)}
            />
          </Field>
        </div>
        <Field label="URL da imagem">
          <TextInput
            disabled={!canMutate}
            type="url"
            placeholder="https://..."
            value={form.image_url}
            onChange={(e) => setForm((current) => ({ ...current, image_url: e.target.value }))}
          />
        </Field>
        <Field label="URL da demo (opcional)">
          <TextInput
            disabled={!canMutate}
            type="url"
            placeholder="https://..."
            value={form.live_url}
            onChange={(e) => setForm((current) => ({ ...current, live_url: e.target.value }))}
          />
        </Field>
        {showRepoUrlInput && (
          <Field label="URL do repositório">
            <TextInput
              required
              disabled={!canMutate}
              type="url"
              placeholder="https://gitlab.com/..."
              value={form.repo_url}
              onChange={(e) => setForm((current) => ({ ...current, repo_url: e.target.value }))}
            />
          </Field>
        )}
      </FormPageLayout>
    </>
  )
}

"use client"

import { useEffect, useState } from "react"

import { FolderGit2, Plus } from "lucide-react"

import { API } from "@/api/client"

import type { AdminProject, ProjectForm, ProjectsPageClientProps } from "./interfaces"

import { useAdminAuth } from "@/contexts/admin-auth"

import { AlertBanner } from "../components/alert-banner"
import { Field, TextArea, TextInput } from "../components/form-fields"
import { FormModal } from "../components/form-modal"
import { PageHeader } from "../components/page-header"
import { RowActions } from "../components/row-actions"
import { adminMutation } from "../../../lib/admin/admin-toast"
import { Button } from "@/components/ui/button"
import { ProjectMeta } from "./project-meta"

const emptyForm: ProjectForm = {
  title: "",
  description: "",
  image_url: "",
  live_url: "",
  repo_url: "",
}

function projectFormFromGitHub(project: AdminProject): ProjectForm {
  return {
    title: project.name,
    description: project.description ?? "",
    image_url: "",
    live_url: project.homepage ?? "",
    repo_url: project.html_url,
  }
}

function projectFormFromVisible(project: AdminProject): ProjectForm {
  return {
    title: project.title ?? project.name,
    description: project.description ?? "",
    image_url: project.image_url ?? "",
    live_url: project.live_url ?? project.homepage ?? "",
    repo_url: project.repo_url ?? project.html_url,
  }
}

function buildPayload(form: ProjectForm, includeRepoUrl: boolean) {
  return {
    title: form.title.trim(),
    description: form.description.trim() || null,
    image_url: form.image_url.trim() || null,
    live_url: form.live_url.trim() || null,
    ...(includeRepoUrl ? { repo_url: form.repo_url.trim() || null } : {}),
  }
}

export function ProjectsPageClient({ initialData }: ProjectsPageClientProps) {
  const { canMutate, refreshAuth } = useAdminAuth()

  const [data, setData] = useState(initialData)
  const [modalOpen, setModalOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [addingGitId, setAddingGitId] = useState<number | null>(null)
  const [editingGitId, setEditingGitId] = useState<number | null>(null)
  const [externalAdd, setExternalAdd] = useState(false)
  const [form, setForm] = useState(emptyForm)

  const showRepoUrlInput =
    externalAdd || (editingGitId !== null && editingGitId < 0)

  useEffect(() => {
    setData(initialData)
  }, [initialData])

  function openAdd(project: AdminProject) {
    setExternalAdd(false)
    setAddingGitId(project.git_id)
    setEditingGitId(null)
    setForm(projectFormFromGitHub(project))
    setModalOpen(true)
  }

  function openExternalAdd() {
    setExternalAdd(true)
    setAddingGitId(null)
    setEditingGitId(null)
    setForm(emptyForm)
    setModalOpen(true)
  }

  function openEdit(project: AdminProject) {
    setExternalAdd(false)
    setAddingGitId(null)
    setEditingGitId(project.git_id)
    setForm(projectFormFromVisible(project))
    setModalOpen(true)
  }

  function closeModal() {
    setModalOpen(false)
    setExternalAdd(false)
    setAddingGitId(null)
    setEditingGitId(null)
    setForm(emptyForm)
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (!canMutate) return

    const gitId = addingGitId ?? editingGitId
    if (!externalAdd && gitId === null) return

    setSubmitting(true)
    const payload = buildPayload(form, showRepoUrlInput)
    const next = await adminMutation<ProjectsPageClientProps["initialData"]>(
      () => {
        if (externalAdd) return API.post("/admin/projects/external", payload)
        if (addingGitId !== null) return API.post(`/admin/projects/${addingGitId}`, payload)
        return API.put(`/admin/projects/${gitId}`, payload)
      },
      externalAdd || addingGitId !== null
        ? `"${payload.title}" adicionado ao portfólio.`
        : `"${payload.title}" atualizado com sucesso.`,
    )
    setSubmitting(false)
    if (!next) return
    setData(next)
    await refreshAuth()
    closeModal()
  }

  async function handleRemove(gitId: number) {
    if (!canMutate) return
    if (!window.confirm("Remover este projeto do portfólio?")) return

    const next = await adminMutation<ProjectsPageClientProps["initialData"]>(
      () => API.delete(`/admin/projects/${gitId}`),
      "Projeto removido do portfólio.",
    )
    if (!next) return
    setData(next)
    await refreshAuth()
  }

  return (
    <div>
      <PageHeader
        title="Projetos"
        description="Selecione repositórios do GitHub ou cadastre projetos externos (GitLab, etc.)"
        icon={FolderGit2}
        canMutate={canMutate}
        onAdd={openExternalAdd}
        addLabel="Projeto externo"
      />

      <div className="space-y-8 p-6 md:p-8">
        {!canMutate && (
          <AlertBanner
            variant="info"
            message="Faça login para adicionar ou remover projetos visíveis."
          />
        )}

        <section className="space-y-4">
          <div>
            <h2 className="font-semibold">Visíveis no portfólio</h2>
            <p className="text-sm text-zinc-500">
              {data.visible.length} projeto(s) selecionado(s)
            </p>
          </div>

          {data.visible.length === 0 ? (
            <p className="text-sm text-zinc-500">Nenhum projeto selecionado.</p>
          ) : (
            <ul className="space-y-3">
              {data.visible.map((project) => (
                <li
                  key={project.git_id}
                  className="flex flex-wrap items-start justify-between gap-3 rounded-lg border border-zinc-200 p-4 dark:border-zinc-800"
                >
                  <div className="min-w-0 flex-1 space-y-2">
                    <div className="space-y-1">
                      <p className="font-medium">{project.title ?? project.name}</p>
                      <ProjectMeta project={project} />
                    </div>
                    {project.description && (
                      <p className="line-clamp-2 text-sm text-zinc-500">
                        {project.description}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-3 text-sm">
                      {(project.repo_url ?? project.html_url) && (
                        <a
                          href={project.repo_url ?? project.html_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-zinc-600 underline-offset-4 hover:underline dark:text-zinc-400"
                        >
                          Repositório
                        </a>
                      )}
                      {(project.live_url ?? project.homepage) && (
                        <a
                          href={project.live_url ?? project.homepage ?? undefined}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-zinc-600 underline-offset-4 hover:underline dark:text-zinc-400"
                        >
                          Demo
                        </a>
                      )}
                    </div>
                  </div>
                  {canMutate && (
                    <RowActions
                      canMutate
                      onEdit={() => openEdit(project)}
                      onDelete={() => handleRemove(project.git_id)}
                    />
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="space-y-4">
          <div>
            <h2 className="font-semibold">Disponíveis no GitHub</h2>
            <p className="text-sm text-zinc-500">
              Repositórios que ainda não estão no portfólio
            </p>
          </div>

          {data.options.length === 0 ? (
            <p className="text-sm text-zinc-500">Nenhum repositório disponível para adicionar.</p>
          ) : (
            <ul className="space-y-3">
              {data.options.map((project) => (
                <li
                  key={project.git_id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-dashed border-zinc-200 p-4 dark:border-zinc-800"
                >
                  <div className="min-w-0 flex-1 space-y-2">
                    <div className="space-y-1">
                      <p className="font-medium">{project.name}</p>
                      <ProjectMeta project={project} />
                    </div>
                    <a
                      href={project.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-zinc-600 underline-offset-4 hover:underline dark:text-zinc-400"
                    >
                      {project.html_url}
                    </a>
                  </div>
                  {canMutate && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-1.5"
                      onClick={() => openAdd(project)}
                    >
                      <Plus className="size-3.5" />
                      Adicionar
                    </Button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <FormModal
        open={modalOpen}
        title={
          externalAdd
            ? "Adicionar projeto externo"
            : addingGitId !== null
              ? "Adicionar projeto"
              : editingGitId !== null && editingGitId < 0
                ? "Editar projeto externo"
                : "Editar projeto"
        }
        submitting={submitting}
        submitLabel={externalAdd || addingGitId !== null ? "Adicionar" : "Salvar"}
        onClose={closeModal}
        onSubmit={handleSubmit}
      >
        <Field label="Título">
          <TextInput
            required
            value={form.title}
            onChange={(e) => setForm((current) => ({ ...current, title: e.target.value }))}
          />
        </Field>
        <Field label="Descrição">
          <TextArea
            value={form.description}
            onChange={(e) => setForm((current) => ({ ...current, description: e.target.value }))}
          />
        </Field>
        <Field label="URL da imagem">
          <TextInput
            type="url"
            placeholder="https://..."
            value={form.image_url}
            onChange={(e) => setForm((current) => ({ ...current, image_url: e.target.value }))}
          />
        </Field>
        <Field label="URL da demo (opcional)">
          <TextInput
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
              type="url"
              placeholder="https://gitlab.com/..."
              value={form.repo_url}
              onChange={(e) => setForm((current) => ({ ...current, repo_url: e.target.value }))}
            />
          </Field>
        )}
      </FormModal>
    </div>
  )
}

"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"

import { FolderGit2, Plus } from "lucide-react"

import { API } from "@/api/client"

import type { ProjectsPageClientProps } from "./interfaces"

import { useAdminAuth } from "@/contexts/admin-auth"

import { AlertBanner } from "../components/alert-banner"
import { PageHeader } from "../components/page-header"
import { RowActions } from "../components/row-actions"
import { adminMutation } from "../../../lib/admin/admin-toast"
import { Button } from "@/components/ui/button"
import { ProjectMeta } from "./project-meta"

export function ProjectsPageClient({ initialData }: ProjectsPageClientProps) {
  const router = useRouter()
  const { canMutate, refreshAuth } = useAdminAuth()

  async function handleRemove(gitId: number) {
    if (!canMutate) return
    if (!window.confirm("Remover este projeto do portfólio?")) return

    const ok = await adminMutation(() => API.delete(`/admin/projects/${gitId}`), "Projeto removido do portfólio.")
    if (!ok) return
    router.refresh()
    await refreshAuth()
  }

  return (
    <div>
      <PageHeader
        title="Projetos"
        description="Selecione repositórios do GitHub ou cadastre projetos externos (GitLab, etc.)"
        icon={FolderGit2}
        canMutate={canMutate}
        addHref="/admin/projects/new?external=1"
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
              {initialData.visible.length} projeto(s) selecionado(s)
            </p>
          </div>

          {initialData.visible.length === 0 ? (
            <p className="text-sm text-zinc-500">Nenhum projeto selecionado.</p>
          ) : (
            <ul className="space-y-3">
              {initialData.visible.map((project) => (
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
                      editHref={`/admin/projects/${project.git_id}`}
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

          {initialData.options.length === 0 ? (
            <p className="text-sm text-zinc-500">Nenhum repositório disponível para adicionar.</p>
          ) : (
            <ul className="space-y-3">
              {initialData.options.map((project) => (
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
                    <Button size="sm" variant="outline" className="gap-1.5" asChild>
                      <Link href={`/admin/projects/new?git_id=${project.git_id}`}>
                        <Plus className="size-3.5" />
                        Adicionar
                      </Link>
                    </Button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  )
}

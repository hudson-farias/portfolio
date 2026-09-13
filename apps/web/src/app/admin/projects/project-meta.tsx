import { Archive, GitFork, Globe, Lock, Star } from "lucide-react"

import type { AdminProject } from "./interfaces"

function formatUpdatedAt(value?: string | null) {
  if (!value) return null

  return new Intl.DateTimeFormat("pt-BR", { dateStyle: "medium" }).format(new Date(value))
}

function MetaBadge({ children, tone = "neutral", }: { children: React.ReactNode; tone?: "neutral" | "public" | "private" | "warning" }) {
  const tones = {
    neutral: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400",
    public: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200",
    private: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200",
    warning: "bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-200",
  }

  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${tones[tone]}`}>
      {children}
    </span>
  )
}

function isExternalProject(project: AdminProject) {
  return project.external === true || project.git_id < 0
}

export function ProjectMeta({ project }: { project: AdminProject }) {
  const updatedAt = formatUpdatedAt(project.updated_at)
  const external = isExternalProject(project)

  return (
    <div className="flex flex-wrap items-center gap-2">
      {external ? (
        <MetaBadge tone="neutral">Externo</MetaBadge>
      ) : project.private ? (
        <MetaBadge tone="private">
          <Lock className="size-3" />
          Privado
        </MetaBadge>
      ) : (
        <MetaBadge tone="public">
          <Globe className="size-3" />
          Público
        </MetaBadge>
      )}

      {!external && project.language && <MetaBadge tone="neutral">{project.language}</MetaBadge>}

      {!external && (project.stars ?? 0) > 0 && (
        <MetaBadge tone="neutral">
          <Star className="size-3" />
          {project.stars}
        </MetaBadge>
      )}

      {!external && (project.forks ?? 0) > 0 && (
        <MetaBadge tone="neutral">
          <GitFork className="size-3" />
          {project.forks}
        </MetaBadge>
      )}

      {!external && project.archived && (
        <MetaBadge tone="warning">
          <Archive className="size-3" />
          Arquivado
        </MetaBadge>
      )}

      {!external && project.fork && <MetaBadge tone="neutral">Fork</MetaBadge>}

      {!external && updatedAt && (
        <span className="text-xs text-zinc-500">Atualizado em {updatedAt}</span>
      )}
    </div>
  )
}

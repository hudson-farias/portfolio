import { RowActions } from "./row-actions"

import type { Project } from "@/types"

export function ProjectsList({
    items,
    canMutate,
}: {
    items: Project[]
    canMutate: boolean
}) {
    if (items.length === 0) {
        return (
            <p className="text-sm text-zinc-500">
                Nenhum projeto público visível. Faça login para ver repositórios privados.
            </p>
        )
    }

    return (
        <ul className="space-y-3">
            {items.map((project) => (
                <li
                    key={project.id}
                    className="flex flex-wrap items-start justify-between gap-3 rounded-lg border border-zinc-200 p-4 dark:border-zinc-800"
                >
                    <div className="min-w-0 flex-1 space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                            <p className="font-medium">{project.name}</p>
                            {project.isPublic === false && (
                                <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs text-amber-800 dark:bg-amber-950 dark:text-amber-200">
                                    Privado
                                </span>
                            )}
                        </div>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400">{project.description}</p>
                    </div>
                    <div className="flex shrink-0 items-center gap-3">
                        <div className="flex gap-3 text-sm">
                            {project.html_url && (
                                <a
                                    href={project.html_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-zinc-600 underline-offset-4 hover:underline dark:text-zinc-400"
                                >
                                    Repo
                                </a>
                            )}
                            {project.homepage && (
                                <a
                                    href={project.homepage}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-zinc-600 underline-offset-4 hover:underline dark:text-zinc-400"
                                >
                                    Demo
                                </a>
                            )}
                        </div>
                        <RowActions
                            canMutate={canMutate}
                            onEdit={() => console.log("edit project", project.id)}
                            onDelete={() => console.log("delete project", project.id)}
                        />
                    </div>
                </li>
            ))}
        </ul>
    )
}

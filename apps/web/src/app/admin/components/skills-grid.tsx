import { AppIcon } from "@/components/icons/app-icon"
import type { Skill } from "@/types"

export const SkillsGrid = ({ skills, canMutate }: { skills: Skill[]; canMutate: boolean }) => {
  if (skills.length === 0) {
    return <p className="text-sm text-zinc-500">Nenhuma skill cadastrada.</p>
  }

  return (
    <ul className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
      {skills.map((skill) => (
        <li
          key={skill.id}
          className="flex items-center justify-between gap-2 rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-600 dark:border-zinc-800 dark:text-zinc-400"
        >
          <span className="inline-flex items-center gap-2">
            <AppIcon name={skill.icon} className="size-4" />
            {skill.name}
          </span>
          {canMutate ? (
            <span className="font-mono text-xs text-zinc-500">{skill.icon}</span>
          ) : null}
        </li>
      ))}
    </ul>
  )
}

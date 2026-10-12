"use client"

import { AppIcon } from "@/components/icons/app-icon"
import type { Dictionary } from "@/i18n/dictionary"
import type { Skill } from "@/themes/types"

import { Reveal } from "../reveal"

function SkillCard({ skill, index }: { skill: Skill; index: number }) {
  const order = String(index + 1).padStart(2, "0")

  return (
    <article
      className="noir-tile group flex min-h-[160px] flex-col justify-between rounded-lg border border-border/40 bg-card p-6 transition-colors duration-200 hover:border-primary"
      title={skill.name}
    >
      <div>
        <div className="mb-4 flex items-center justify-between">
          <span className="flex size-9 items-center justify-center rounded-md bg-muted text-primary transition-transform duration-150 group-hover:scale-105">
            <AppIcon name={skill.icon} className="size-5" />
          </span>
          <span className="font-mono text-[11px] text-muted-foreground/60">{order}</span>
        </div>
        <h2 className="font-heading text-lg font-semibold tracking-tight text-foreground">
          {skill.name}
        </h2>
      </div>
    </article>
  )
}

export function StackSkillsView({
  skills,
  copy,
}: {
  skills: Skill[]
  copy: Pick<Dictionary["skillsPage"], "empty">
}) {
  if (skills.length === 0) {
    return <p className="text-center text-muted-foreground">{copy.empty}</p>
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {skills.map((skill, index) => (
        <Reveal key={skill.id} variant="scale" delay={80 + index * 50}>
          <SkillCard skill={skill} index={index} />
        </Reveal>
      ))}
    </div>
  )
}

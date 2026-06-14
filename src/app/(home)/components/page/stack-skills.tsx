"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { AppIcon } from "@/components/icons/app-icon"
import { Reveal } from "../reveal"
import { routes } from "@/lib/site-routes"
import type { Skill } from "@/types"

const tileClassName =
  "surface surface-tile flex min-h-[88px] w-full flex-col items-center justify-center rounded-2xl p-3 text-center transition-[transform,colors,box-shadow] duration-300 ease-out hover:z-10 hover:scale-[1.03] hover:-translate-y-1 hover:border-foreground/20 hover:shadow-lg"

function SkillTile({ skill }: { skill: Skill }) {
  return (
    <article className={tileClassName} title={skill.name}>
      <AppIcon name={skill.icon} className="size-5" />
      <span className="mt-2 text-xs font-medium leading-tight">{skill.name}</span>
    </article>
  )
}

export function StackSkills({
  skills,
  limit = 8,
}: {
  skills: Skill[]
  limit?: number
}) {
  if (skills.length === 0) return null

  const visibleItems = skills.slice(0, limit)
  const hasMore = skills.length > limit

  return (
    <section id="stack-skills" className="relative isolate z-0 scroll-mt-28 space-y-10">
      <Reveal className="mx-auto max-w-2xl space-y-3 text-center">
        <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Skills</h2>
        <p className="text-muted-foreground">
          Conceitos, práticas e competências que complementam o stack técnico.
        </p>
      </Reveal>

      <Reveal delay={120}>
        <div className="mx-auto flex w-full max-w-6xl flex-wrap justify-center gap-3 px-6 md:px-10">
          {visibleItems.map((skill, index) => (
            <Reveal
              key={skill.id}
              variant="scale"
              delay={80 + index * 60}
              className="w-28 sm:w-32 md:w-36"
            >
              <SkillTile skill={skill} />
            </Reveal>
          ))}
        </div>
      </Reveal>

      <Reveal delay={160}>
        <div className="flex justify-center">
          <Link
            href={routes.skills}
            className="inline-flex cursor-pointer items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            {hasMore ? "Ver todas as skills" : "Ver skills"}
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </Reveal>
    </section>
  )
}

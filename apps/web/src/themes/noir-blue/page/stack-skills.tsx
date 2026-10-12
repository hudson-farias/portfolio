"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { AppIcon } from "@/components/icons/app-icon"
import type { Skill, SkillsCopy } from "@/themes/types"

import { Reveal } from "../reveal"
import { SectionEyebrow, SectionLead, SectionTitle } from "../section-heading"

const tileClassName =
  "noir-tile flex min-h-[120px] w-full flex-col rounded-lg border border-border/60 bg-card p-5 transition-colors hover:border-primary md:p-6"

function SkillTile({ skill }: { skill: Skill }) {
  return (
    <article className={tileClassName} title={skill.name}>
      <AppIcon name={skill.icon} className="mb-3 size-6 text-primary" />
      <h4 className="font-heading text-base font-semibold tracking-tight">{skill.name}</h4>
    </article>
  )
}

export function StackSkills({
  skills,
  copy,
  skillsHref,
  limit = 8,
}: {
  skills: Skill[]
  copy: SkillsCopy
  skillsHref: string
  limit?: number
}) {
  if (skills.length === 0) return null

  const visibleItems = skills.slice(0, limit)
  const hasMore = skills.length > limit

  return (
    <section id="stack-skills" className="scroll-mt-28 border-t border-border/30 pt-16 md:pt-24">
      <Reveal className="mb-10 max-w-3xl">
        <SectionEyebrow>07 / {copy.title}</SectionEyebrow>
        <SectionTitle className="mb-3">{copy.title}</SectionTitle>
        <SectionLead>{copy.description}</SectionLead>
      </Reveal>

      <Reveal delay={120}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visibleItems.map((skill, index) => (
            <Reveal key={skill.id} variant="scale" delay={80 + index * 50}>
              <SkillTile skill={skill} />
            </Reveal>
          ))}
        </div>
      </Reveal>

      <Reveal delay={160} className="mt-8">
        <Link
          href={skillsHref}
          className="inline-flex cursor-pointer items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:underline"
        >
          {hasMore ? copy.ctaAll : copy.cta}
          <ArrowRight className="size-4" />
        </Link>
      </Reveal>
    </section>
  )
}

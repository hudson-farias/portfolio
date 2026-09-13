"use client"

import { AppIcon } from "@/components/icons/app-icon"
import { Reveal } from "../reveal"
import { useSiteLocale } from "@/i18n/site-locale-provider"
import type { Skill } from "@/types"

const skillTileClassName =
  "surface surface-tile flex min-h-[72px] flex-col items-center justify-center rounded-xl p-2.5 text-center transition-[transform,colors,box-shadow] duration-300 ease-out hover:z-10 hover:scale-[1.03] hover:-translate-y-0.5 hover:border-foreground/20 hover:shadow-md"

function SkillTile({ name, icon }: { name: string; icon: string }) {
  return (
    <article className={skillTileClassName} title={name}>
      <AppIcon name={icon} className="size-5" />
      <span className="mt-1.5 text-xs font-medium leading-tight">{name}</span>
    </article>
  )
}

export function StackSkillsView({ skills }: { skills: Skill[] }) {
  const { t } = useSiteLocale()

  if (skills.length === 0) {
    return <p className="text-center text-muted-foreground">{t.skillsPage.empty}</p>
  }

  return (
    <Reveal>
      <div className="mx-auto grid max-w-4xl grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
        {skills.map((skill) => (
          <SkillTile key={skill.id} name={skill.name} icon={skill.icon} />
        ))}
      </div>
    </Reveal>
  )
}

"use client"

import type { AdminSkill } from "../interfaces"
import { SkillsFormClient } from "../skills-form-client"

export const SkillsEditPageClient = ({ skill }: { skill: AdminSkill }) => {
  return (
    <SkillsFormClient
      mode="edit"
      skillId={skill.id}
      initialForm={{ name: skill.name, icon: skill.icon }}
    />
  )
}

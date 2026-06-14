export interface AdminSkill {
  id: number
  name: string
  icon: string
}

export interface AdminSkills {
  skills: AdminSkill[]
}

export interface SkillForm {
  name: string
  icon: string
}

export interface SkillsPageClientProps {
  initialData: AdminSkills
}

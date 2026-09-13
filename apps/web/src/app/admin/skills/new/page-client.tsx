import { SkillsFormClient } from "../skills-form-client"

const emptyForm = { name: "", icon: "" }

export const SkillsNewPageClient = () => {
  return <SkillsFormClient mode="create" initialForm={emptyForm} />
}

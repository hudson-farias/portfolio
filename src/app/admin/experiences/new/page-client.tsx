import { emptyExperienceForm, ExperiencesFormClient } from "../experiences-form-client"
import type { ExperienceRole } from "../interfaces"
import type { AdminFramework } from "../../frameworks/interfaces"

export const ExperiencesNewPageClient = ({ roles, frameworks }: { roles: ExperienceRole[]; frameworks: AdminFramework[] }) => {
  const defaultRoleId = roles[0] ? String(roles[0].id) : ""

  return (
    <ExperiencesFormClient
      mode="create"
      initialForm={emptyExperienceForm(defaultRoleId)}
      roles={roles}
      frameworks={frameworks}
    />
  )
}

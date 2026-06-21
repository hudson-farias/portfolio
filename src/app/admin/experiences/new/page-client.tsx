import { emptyExperienceForm, ExperiencesFormClient } from "../experiences-form-client"
import type { ExperienceRole } from "../interfaces"

export const ExperiencesNewPageClient = ({ roles }: { roles: ExperienceRole[] }) => {
  const defaultRoleId = roles[0] ? String(roles[0].id) : ""

  return (
    <ExperiencesFormClient
      mode="create"
      initialForm={emptyExperienceForm(defaultRoleId)}
      roles={roles}
    />
  )
}

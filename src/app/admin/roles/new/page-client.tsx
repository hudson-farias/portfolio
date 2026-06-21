import { RolesFormClient, emptyRoleForm } from "../roles-form-client"

export const RolesNewPageClient = () => {
  return <RolesFormClient mode="create" initialForm={emptyRoleForm} />
}

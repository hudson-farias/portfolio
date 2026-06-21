import { DatabasesFormClient } from "../databases-form-client"

const emptyForm = { name: "", icon: "", scope: "" as const }

export const DatabasesNewPageClient = () => {
  return <DatabasesFormClient mode="create" initialForm={emptyForm} />
}

import { LanguagesFormClient } from "../languages-form-client"

const emptyForm = { name: "", icon: "" }

export const LanguagesNewPageClient = () => {
  return <LanguagesFormClient mode="create" initialForm={emptyForm} />
}

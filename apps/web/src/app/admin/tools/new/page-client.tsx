import { ToolsFormClient } from "../tools-form-client"

const emptyForm = { name: "", icon: "", url: "" }

export const ToolsNewPageClient = () => {
  return <ToolsFormClient mode="create" initialForm={emptyForm} />
}

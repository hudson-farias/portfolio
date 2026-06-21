"use client"

import type { AdminLanguage } from "../../languages/interfaces"
import { FrameworksFormClient } from "../frameworks-form-client"

const emptyForm = { name: "", icon: "", scope: "" as const, language_ids: [] as number[] }

export const FrameworksNewPageClient = ({ languages }: { languages: AdminLanguage[] }) => {
  return <FrameworksFormClient mode="create" initialForm={emptyForm} languages={languages} />
}

"use client"

import type { AdminFramework } from "../interfaces"
import type { AdminLanguage } from "../../languages/interfaces"
import { FrameworksFormClient } from "../frameworks-form-client"

export const FrameworksEditPageClient = ({ framework, languages }: { framework: AdminFramework; languages: AdminLanguage[] }) => {
  return (
    <FrameworksFormClient
      mode="edit"
      frameworkId={framework.id}
      languages={languages}
      initialForm={{
        name: framework.name,
        icon: framework.icon,
        scope: framework.scope ?? "",
        language_ids: framework.languages.map((language) => language.id),
      }}
    />
  )
}

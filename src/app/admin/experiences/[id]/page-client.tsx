"use client"

import type { AdminExperience, ExperienceForm, ExperienceRole, ExperienceTranslationFields } from "../interfaces"
import type { AdminFramework } from "../../frameworks/interfaces"
import { ExperiencesFormClient } from "../experiences-form-client"
import { resolveTranslations } from "@/lib/admin/locale"

const TRANSLATION_KEYS: (keyof ExperienceTranslationFields)[] = ["period", "description"]

function emptyExperienceTranslationFields(): ExperienceTranslationFields {
  return { period: "", description: "" }
}

function experienceToForm(item: AdminExperience): ExperienceForm {
  return {
    company: item.company,
    role_id: item.role_id !== null ? String(item.role_id) : "",
    contract_type: item.contract_type ?? "",
    live_url: item.live_url ?? "",
    hidden: item.hidden ?? false,
    framework_ids: item.framework_ids ?? item.frameworks?.map((framework) => framework.id) ?? [],
    translations: resolveTranslations(
      TRANSLATION_KEYS,
      item.translations?.pt ?? {},
      item.translations,
      emptyExperienceTranslationFields,
    ),
  }
}

export const ExperiencesEditPageClient = ({ experience, roles, frameworks }: { experience: AdminExperience; roles: ExperienceRole[]; frameworks: AdminFramework[] }) => {
  return (
    <ExperiencesFormClient
      mode="edit"
      experienceId={experience.id}
      initialForm={experienceToForm(experience)}
      roles={roles}
      frameworks={frameworks}
    />
  )
}

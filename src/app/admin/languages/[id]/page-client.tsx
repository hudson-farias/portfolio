"use client"

import type { AdminLanguage } from "../interfaces"
import { LanguagesFormClient } from "../languages-form-client"

export const LanguagesEditPageClient = ({ language }: { language: AdminLanguage }) => {
  return (
    <LanguagesFormClient
      mode="edit"
      languageId={language.id}
      initialForm={{ name: language.name, icon: language.icon }}
    />
  )
}

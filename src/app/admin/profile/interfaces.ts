import type { LocaleCode, Translations } from "@/lib/admin/locale"

export interface ProfileTranslationFields {
  summary: string
  about_me: string
  location: string
}

export interface AdminProfile {
  name: string
  last_name: string
  available: boolean
  email: string
  whatsapp: string
  linkedin: string
  github: string
  gitlab: string
  translations: Translations<ProfileTranslationFields>
}

export interface ProfileForm {
  name: string
  last_name: string
  available: boolean
  email: string
  whatsapp: string
  linkedin: string
  github: string
  gitlab: string
  translations: Record<LocaleCode, ProfileTranslationFields>
}

export interface ProfilePageClientProps {
  initialProfile: AdminProfile | null
}

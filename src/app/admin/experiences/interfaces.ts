import type { ContractType } from "@/types"
import type { LocaleCode, Translations } from "@/lib/admin/locale"

export interface ExperienceTranslationFields {
  period: string
  description: string
}

export interface AdminExperience {
  id: number
  company: string
  period: string
  role_id: number | null
  role_title: string | null
  contract_type: ContractType | null
  description: string
  live_url?: string | null
  hidden?: boolean
  translations?: Translations<ExperienceTranslationFields>
}

export interface ExperienceRole {
  id: number
  title: string
  active: boolean
}

export interface AdminExperiences {
  experiences: AdminExperience[]
  roles: ExperienceRole[]
}

export type { ContractType }

export interface ExperienceForm {
  company: string
  role_id: string
  contract_type: string
  live_url: string
  hidden: boolean
  translations: Record<LocaleCode, ExperienceTranslationFields>
}

export interface ExperiencesPageClientProps {
  initialData: AdminExperiences
}

export interface ContractTypeOption {
  value: ContractType
  label: string
}

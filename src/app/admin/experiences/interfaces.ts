import type { ContractType } from "@/types"

export interface AdminExperience {
  id: number
  company: string
  period: string
  role_id: number | null
  role_title: string | null
  contract_type: ContractType | null
  description: string
  hidden?: boolean
}

export interface ExperienceRole {
  id: number
  title: string
  locale: string | null
  active: boolean
}

export interface AdminExperiences {
  experiences: AdminExperience[]
  roles: ExperienceRole[]
}

export type { ContractType }

export interface ExperienceForm {
  company: string
  period: string
  role_id: string
  contract_type: string
  description: string
  hidden: boolean
}

export interface ExperiencesPageClientProps {
  initialData: AdminExperiences
}

export interface ContractTypeOption {
  value: ContractType
  label: string
}

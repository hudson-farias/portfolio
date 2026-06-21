import type { LocaleCode, Translations } from "@/lib/admin/locale"

export type RoleSeniority = "Junior" | "Pleno" | "Senior" | "Lead"

export interface RoleTranslationFields {
  title: string
  summary: string
}

export interface AdminRole {
  id: number
  title: string
  category: string | null
  seniority: RoleSeniority | null
  show: boolean
  featured: boolean
  active: boolean
  sort_order: number
  color: string | null
  icon: string | null
  experience_count: number
  translations?: Translations<RoleTranslationFields>
}

export interface RoleForm {
  category: string
  seniority: string
  show: boolean
  featured: boolean
  active: boolean
  sort_order: number
  color: string
  icon: string
  translations: Record<LocaleCode, RoleTranslationFields>
}

export interface RolesPageClientProps {
  initialItems: AdminRole[]
}

export interface SeniorityOption {
  value: RoleSeniority
  label: string
}

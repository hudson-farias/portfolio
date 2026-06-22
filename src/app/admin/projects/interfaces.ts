import type { LocaleCode, Translations } from "@/lib/admin/locale"
import type { FrameworkRef } from "../experiences/interfaces"

export interface ProjectTranslationFields {
  title: string
  description: string
}

export interface AdminProject {
  git_id: number
  name: string
  html_url: string
  homepage?: string | null
  description?: string | null
  title?: string | null
  image_url?: string | null
  live_url?: string | null
  repo_url?: string | null
  private?: boolean
  language?: string | null
  stars?: number
  forks?: number
  updated_at?: string | null
  archived?: boolean
  fork?: boolean
  external?: boolean
  framework_ids?: number[]
  frameworks?: FrameworkRef[]
  translations?: Translations<ProjectTranslationFields>
}

export interface AdminProjects {
  visible: AdminProject[]
  options: AdminProject[]
}

export interface ProjectForm {
  image_url: string
  live_url: string
  repo_url: string
  framework_ids: number[]
  translations: Record<LocaleCode, ProjectTranslationFields>
}

export interface ProjectsPageClientProps {
  initialData: AdminProjects
}

import type { AdminLanguage } from "../languages/interfaces"

export type FrameworkScope = "backend" | "frontend" | ""

export interface AdminFramework {
  id: number
  name: string
  icon: string
  scope: FrameworkScope | null
  sort_order: number
  languages: AdminLanguage[]
}

export interface FrameworkForm {
  name: string
  icon: string
  scope: FrameworkScope
  language_ids: number[]
}

export interface FrameworksPageClientProps {
  initialItems: AdminFramework[]
  languages: AdminLanguage[]
}

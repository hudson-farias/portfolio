import type { AdminLanguage } from "../languages/interfaces"

import type { FrameworkScope, FrameworkScopeValue } from "@/lib/framework-scope"

export type { FrameworkScope, FrameworkScopeValue }

export interface AdminFramework {
  id: number
  name: string
  icon: string
  scope: FrameworkScopeValue | null
  show: boolean
  sort_order: number
  languages: AdminLanguage[]
}

export interface FrameworkForm {
  name: string
  icon: string
  scope: FrameworkScopeValue | ""
  show: boolean
  language_ids: number[]
}

export interface FrameworksPageClientProps {
  initialItems: AdminFramework[]
}

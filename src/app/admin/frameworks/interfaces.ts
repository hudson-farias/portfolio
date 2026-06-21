import type { AdminLanguage } from "../languages/interfaces"

import type { FrameworkScope, FrameworkScopeValue } from "@/lib/framework-scope"

export type { FrameworkScope, FrameworkScopeValue }

export interface AdminFramework {
  id: number
  name: string
  icon: string
  scope: FrameworkScopeValue | null
  sort_order: number
  languages: AdminLanguage[]
}

export interface FrameworkForm {
  name: string
  icon: string
  scope: FrameworkScopeValue | ""
  language_ids: number[]
}

export interface FrameworksPageClientProps {
  initialItems: AdminFramework[]
}

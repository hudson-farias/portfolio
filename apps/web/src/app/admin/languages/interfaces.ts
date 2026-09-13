export interface AdminLanguage {
  id: number
  name: string
  icon: string
  sort_order: number
}

export interface LanguageForm {
  name: string
  icon: string
}

export interface LanguagesPageClientProps {
  initialItems: AdminLanguage[]
}

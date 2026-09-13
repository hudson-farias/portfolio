export type DatabaseScope = "sql" | "nosql" | ""

export interface AdminDatabase {
  id: number
  name: string
  icon: string
  scope: DatabaseScope | null
  sort_order: number
}

export interface DatabaseForm {
  name: string
  icon: string
  scope: DatabaseScope
}

export interface DatabasesPageClientProps {
  initialItems: AdminDatabase[]
}

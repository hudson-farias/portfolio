export interface Skill {
  id: number
  name: string
  icon: string
}

export type ContractType = "CLT" | "PJ" | "FREELANCER"

export interface Experience {
  id: number
  company: string
  period: string
  role: string
  contract_type?: ContractType | null
  description: string
  hidden?: boolean
}

export interface Project {
  id: number
  name: string
  description?: string
  image_url?: string | null
  homepage?: string | null
  html_url?: string | null
  isPublic?: boolean
}

export interface SocialNetwork {
  id: number
  url: string
  icon: string
}

export interface Tool {
  id: number
  name: string
  icon: string
  url?: string | null
}

export interface LanguageRef {
  id: number
  name: string
  icon: string
}

export interface Framework {
  id: number
  name: string
  icon: string
  scope?: "backend" | "frontend" | null
  languages: LanguageRef[]
}

export interface Database {
  id: number
  name: string
  icon: string
  scope?: "sql" | "nosql" | null
}

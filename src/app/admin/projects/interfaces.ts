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
}

export interface AdminProjects {
  visible: AdminProject[]
  options: AdminProject[]
}

export interface ProjectForm {
  title: string
  description: string
  image_url: string
  live_url: string
  repo_url: string
}

export interface ProjectsPageClientProps {
  initialData: AdminProjects
}

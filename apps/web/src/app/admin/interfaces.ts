import type { Experience, Project, Skill } from "@/types"
import type { AdminSocialNetwork } from "./social-networks/interfaces"
import type { AdminTool } from "./tools/interfaces"
import type { AdminLanguage } from "./languages/interfaces"
import type { AdminFramework } from "./frameworks/interfaces"
import type { AdminDatabase } from "./databases/interfaces"

export interface AdminDashboard {
  counts: {
    experiences: number
    skills: number
    projects: number
    social_networks: number
    tools: number
    languages: number
    frameworks: number
    databases: number
  }
  experiences: Experience[]
  projects: Project[]
  skills: Skill[]
  social_networks: AdminSocialNetwork[]
  tools: AdminTool[]
  languages: AdminLanguage[]
  frameworks: AdminFramework[]
  databases: AdminDatabase[]
}

export interface AdminPageClientProps {
  data: AdminDashboard
}

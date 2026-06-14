import type { Experience, Project, SkillCategory } from "@/types"
import type { AdminSocialNetwork } from "./social-networks/interfaces"
import type { AdminTool } from "./tools/interfaces"

export interface AdminDashboard {
  counts: {
    experiences: number
    skills: number
    projects: number
    social_networks: number
    tools: number
  }
  experiences: Experience[]
  projects: Project[]
  skills: SkillCategory[]
  social_networks: AdminSocialNetwork[]
  tools: AdminTool[]
}

export interface AdminPageClientProps {
  data: AdminDashboard
}

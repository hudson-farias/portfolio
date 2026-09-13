export interface AdminTool {
  id: number
  name: string
  icon: string
  url: string | null
  sort_order: number
}

export interface ToolForm {
  name: string
  icon: string
  url: string
}

export interface ToolsPageClientProps {
  initialItems: AdminTool[]
}

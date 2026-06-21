"use client"

import type { AdminTool } from "../interfaces"
import { ToolsFormClient } from "../tools-form-client"

export const ToolsEditPageClient = ({ tool }: { tool: AdminTool }) => {
  return (
    <ToolsFormClient
      mode="edit"
      toolId={tool.id}
      initialForm={{ name: tool.name, icon: tool.icon, url: tool.url ?? "" }}
    />
  )
}

"use client"

import type { AdminDatabase } from "../interfaces"
import { DatabasesFormClient } from "../databases-form-client"

export const DatabasesEditPageClient = ({ database }: { database: AdminDatabase }) => {
  return (
    <DatabasesFormClient
      mode="edit"
      databaseId={database.id}
      initialForm={{ name: database.name, icon: database.icon, scope: database.scope ?? "" }}
    />
  )
}

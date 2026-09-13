import { API } from "@/api/server"

import { AdminPageClient } from "./page-client"
import type { AdminDashboard } from "./interfaces"

export default async function AdminPage() {
  const response = await API.get("/admin")
  const data: AdminDashboard = await response.json()

  return <AdminPageClient data={data} />
}

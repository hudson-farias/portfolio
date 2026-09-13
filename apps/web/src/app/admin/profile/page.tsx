import { API } from "@/api/server"

import { ProfilePageClient } from "./page-client"
import type { AdminProfile } from "./interfaces"

export default async function ProfilePage() {
  const response = await API.get("/admin/profile")

  if (!response.ok) {
    return <ProfilePageClient initialProfile={null} />
  }

  const profile: AdminProfile = await response.json()

  return <ProfilePageClient initialProfile={profile} />
}

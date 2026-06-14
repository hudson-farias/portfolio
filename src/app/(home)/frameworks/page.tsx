import type { Metadata } from "next"

import { API } from "@/api/server"
import { PageIntro } from "../components/page-intro"
import { FrameworksView } from "../components/page/frameworks-view"
import type { Framework } from "@/types"

export const metadata: Metadata = {
  title: "Frameworks",
  description: "Frameworks e bibliotecas do meu dia a dia em backend e frontend.",
}

export default async function FrameworksPage() {
  const response = await API.get("/landpage/frameworks")
  if (!response.ok) throw new Error("Não foi possível carregar os frameworks.")

  const { frameworks }: { frameworks: Framework[] } = await response.json()

  return (
    <div className="space-y-10">
      <PageIntro
        title="Frameworks"
        description="Frameworks e bibliotecas do meu dia a dia em backend e frontend."
      />
      <FrameworksView frameworks={frameworks} />
    </div>
  )
}

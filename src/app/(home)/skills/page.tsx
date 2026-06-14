import type { Metadata } from "next"

import { API } from "@/api/server"
import { PageIntro } from "../components/page-intro"
import { StackSkillsView } from "../components/page/stack-skills-view"
import type { SkillsResponse } from "../interfaces"

export const metadata: Metadata = {
  title: "Skills",
  description: "Conceitos, práticas e competências que complementam o stack técnico.",
}

export default async function SkillsPage() {
  const response = await API.get("/landpage/skills")
  if (!response.ok) throw new Error("Não foi possível carregar as skills.")

  const { skills }: SkillsResponse = await response.json()

  return (
    <div className="space-y-10">
      <PageIntro
        title="Skills"
        description="Conceitos, práticas e competências que complementam o stack técnico."
      />
      <StackSkillsView skills={skills} />
    </div>
  )
}

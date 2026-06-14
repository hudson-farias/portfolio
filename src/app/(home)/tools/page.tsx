import type { Metadata } from "next"

import { API } from "@/api/server"
import { PageIntro } from "../components/page-intro"
import { Tools } from "../components/page/tools"
import type { ToolsResponse } from "../interfaces"

export const metadata: Metadata = {
  title: "Ferramentas",
  description: "Ferramentas e software que uso no dia a dia para desenvolver.",
}

export default async function FerramentasPage() {
  const response = await API.get("/landpage/tools")
  if (!response.ok) throw new Error("Não foi possível carregar as ferramentas.")

  const { tools }: ToolsResponse = await response.json()

  return (
    <div className="space-y-10">
      <PageIntro
        title="Ferramentas que uso"
        description="O stack de ferramentas que uso no dia a dia para desenvolver."
      />
      <Tools tools={tools} embedded />
    </div>
  )
}

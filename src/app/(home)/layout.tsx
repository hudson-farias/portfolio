import { API } from "@/api/server"

import { Footer } from "./components/layout/footer"
import { Header } from "./components/layout/header"
import type { LayoutResponse } from "./interfaces"

export default async function HomeLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const response = await API.get("/landpage/layout")
  const { footer, hero }: LayoutResponse = await response.json()

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />

      <main className="mx-auto flex w-full max-w-6xl flex-col gap-24 px-6 py-10 md:px-10 md:py-14">
        {children}
      </main>

      <Footer profileName={hero.profile.name} profileTagline={hero.profile.about} socialNetworks={footer.social_networks} />
    </div>
  )
}

"use client"

import { AppIcon } from "@/components/icons/app-icon"
import { Reveal } from "../reveal"
import { formatSocialAriaLabel } from "@/lib/social-label"
import type { Stats, SocialNetwork } from "../../interfaces"

export const About = ({
  aboutExtended,
  stats,
  socialNetworks,
  profileName,
}: {
  aboutExtended: string
  stats: Stats
  socialNetworks: SocialNetwork[]
  profileName: string
}) => {
  return (
    <section id="about" className="scroll-mt-28 space-y-12">
      <Reveal className="mx-auto max-w-3xl space-y-4 text-center">
        <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Sobre mim</h2>
        <p className="text-lg leading-relaxed text-muted-foreground">{aboutExtended}</p>
      </Reveal>

      <div className="flex flex-wrap items-center justify-center gap-4 border-b pb-10">
        <Reveal variant="fade">
          <span className="text-sm text-muted-foreground">Me siga:</span>
        </Reveal>
        <div className="flex items-center gap-2">
          {socialNetworks.map((network, i) => (
            <Reveal key={network.id} as="span" variant="scale" delay={i * 80}>
              <a
                href={network.url}
                target="_blank"
                rel="noopener noreferrer"
                className="surface inline-flex size-10 items-center justify-center rounded-full text-muted-foreground transition-[transform,colors] hover:-translate-y-0.5 hover:border-foreground/20 hover:text-foreground"
                aria-label={formatSocialAriaLabel(network.icon, profileName)}
              >
                <AppIcon name={network.icon} className="size-4" />
              </a>
            </Reveal>
          ))}
        </div>
      </div>

      <div className="grid gap-6 pt-10 sm:grid-cols-3">
        {[
          { value: `${String(stats.yearsExperience).padStart(2, "0")}+`, label: "Anos de experiência" },
          { value: String(stats.projectsCount).padStart(2, "0"), label: "Repos na vitrine" },
          { value: `${String(stats.clientsCount).padStart(2, "0")}+`, label: "Empresas" },
        ].map((stat, i) => (
          <Reveal key={stat.label} variant="scale" delay={i * 100} className="text-center">
            <p className="text-4xl font-bold tracking-tight">{stat.value}</p>
            <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

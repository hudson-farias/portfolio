"use client"

import { AppIcon } from "@/components/icons/app-icon"
import { formatSocialAriaLabel, socialNetworkLabel } from "@/lib/social-label"
import type { AboutCopy, AboutResponse, AboutStats, SocialNetwork, Stats } from "@/themes/types"

import { Reveal } from "../reveal"
import { SectionEyebrow, SectionTitle } from "../section-heading"

type AboutLink = {
  key: string
  icon: string
  url: string
}

function buildAboutLinks(about: Pick<AboutResponse, "linkedin" | "social_networks">): AboutLink[] {
  const links: AboutLink[] = [{ key: "linkedin", icon: "linkedin", url: about.linkedin }]

  for (const network of about.social_networks) {
    links.push({
      key: `network-${network.id}`,
      icon: network.icon,
      url: network.url,
    })
  }

  return links.filter((link) => Boolean(link.url))
}

export const About = ({
  aboutExtended,
  stats,
  linkedin,
  socialNetworks,
  profileName,
  copy,
}: {
  aboutExtended: string
  stats: AboutStats | Stats
  linkedin: string
  socialNetworks: SocialNetwork[]
  profileName: string
  copy: AboutCopy
}) => {
  const links = buildAboutLinks({ linkedin, social_networks: socialNetworks })

  return (
    <section id="about" className="scroll-mt-28 border-t border-border/30 pt-16 md:pt-24">
      <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12">
        <Reveal className="lg:col-span-4">
          <SectionEyebrow>01 / {copy.title}</SectionEyebrow>
          <SectionTitle>{copy.title}</SectionTitle>
        </Reveal>

        <div className="flex flex-col gap-8 lg:col-span-8">
          <Reveal delay={80}>
            <p className="text-lg leading-relaxed text-muted-foreground">{aboutExtended}</p>
          </Reveal>

          <Reveal delay={120}>
            <div className="grid grid-cols-1 gap-4 border-t border-border/30 pt-6 sm:grid-cols-2">
              {[
                {
                  value: `+${String(stats.yearsExperience)}`,
                  label: copy.yearsExperience,
                },
                {
                  value: `+${String(stats.projectsCount)}`,
                  label: copy.projectsInShowcase,
                },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="noir-tile rounded-lg border border-border/60 bg-card p-6 transition-colors hover:border-primary/40"
                >
                  <p className="font-heading text-3xl font-bold tracking-tight">{stat.value}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </Reveal>

          {links.length > 0 ? (
            <Reveal delay={160} className="flex flex-wrap items-center gap-5">
              <span className="text-sm text-muted-foreground">{copy.follow}</span>
              {links.map((link) => (
                <a
                  key={link.key}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex cursor-pointer items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                  aria-label={formatSocialAriaLabel(link.icon, profileName)}
                >
                  <AppIcon name={link.icon} className="size-4" />
                  <span>{socialNetworkLabel(link.icon)}</span>
                </a>
              ))}
            </Reveal>
          ) : null}
        </div>
      </div>
    </section>
  )
}

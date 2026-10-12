"use client"

import Link from "next/link"

import { AppIcon } from "@/components/icons/app-icon"
import { formatSocialAriaLabel } from "@/lib/social-label"
import type { FooterProps, FooterResponse } from "@/themes/types"

import { Reveal } from "../reveal"

type FooterLink = {
  key: string
  icon: string
  url: string
}

function buildFooterLinks(footer: FooterResponse): FooterLink[] {
  const links: FooterLink[] = [
    { key: "github", icon: "github", url: footer.github },
    { key: "gitlab", icon: "gitlab", url: footer.gitlab },
    { key: "linkedin", icon: "linkedin", url: footer.linkedin },
  ]

  for (const network of footer.social_networks) {
    links.push({
      key: `network-${network.id}`,
      icon: network.icon,
      url: network.url,
    })
  }

  return links.filter((link) => Boolean(link.url))
}

export const Footer = ({
  profileName,
  profileTagline,
  footer,
  copy,
  pageLinks,
  stackLinks,
}: FooterProps) => {
  const socialLinks = buildFooterLinks(footer)
  const contactLink = pageLinks.find(
    (link) => /contact|contato/i.test(link.href) || /contact|contato/i.test(link.label),
  )
  const otherPageLinks = pageLinks.filter((link) => link !== contactLink)
  const quickLinks = [
    ...otherPageLinks.slice(0, 3),
    ...stackLinks.slice(0, 1),
    ...(contactLink ? [contactLink] : []),
  ]

  return (
    <footer className="mt-8 border-t border-border/40">
      <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-8 px-4 py-12 sm:px-8 lg:px-20">
        <div className="flex flex-col items-center justify-between gap-8 md:flex-row md:items-start">
          <Reveal className="max-w-md text-center md:text-left">
            <p className="font-heading text-lg font-bold tracking-tight">{profileName}</p>
            <p className="mt-2 text-sm text-muted-foreground">{profileTagline}</p>
          </Reveal>

          <Reveal delay={80} className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {quickLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="cursor-pointer text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </Reveal>

          {socialLinks.length > 0 ? (
            <Reveal delay={120} className="flex flex-wrap items-center justify-center gap-2">
              {socialLinks.map((link) => (
                <a
                  key={link.key}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={formatSocialAriaLabel(link.icon, profileName)}
                  className="inline-flex size-9 cursor-pointer items-center justify-center rounded-md border border-border/60 text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
                  aria-label={formatSocialAriaLabel(link.icon, profileName)}
                >
                  <AppIcon name={link.icon} className="size-4" />
                </a>
              ))}
            </Reveal>
          ) : null}
        </div>

        <div className="flex flex-col items-center justify-between gap-2 border-t border-border/30 pt-6 text-center text-sm text-muted-foreground md:flex-row md:text-left">
          <p>
            © {footer.career_start} — {new Date().getFullYear()} {profileName}.
          </p>
          <p>{copy.rights}</p>
        </div>
      </div>
    </footer>
  )
}

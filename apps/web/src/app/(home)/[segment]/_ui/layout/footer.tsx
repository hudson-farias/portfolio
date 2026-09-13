"use client"

import Link from "next/link"

import { AppIcon } from "@/components/icons/app-icon"
import { Reveal } from "../reveal"
import { formatSocialAriaLabel } from "@/lib/social-label"
import { useSiteLocale } from "@/i18n/site-locale-provider"
import type { FooterResponse } from "@/app/(home)/[segment]/layout.interfaces"

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

  return links
}

function FooterLinkList({ links }: { links: { label: string; href: string }[] }) {
  return (
    <ul className="space-y-2">
      {links.map((link) => (
        <li key={link.href}>
          <Link
            href={link.href}
            className="cursor-pointer text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  )
}

export const Footer = ({
  profileName,
  profileTagline,
  footer,
}: {
  profileName: string
  profileTagline: string
  footer: FooterResponse
}) => {
  const { t, routes } = useSiteLocale()
  const links = buildFooterLinks(footer)

  const footerPageLinks = [
    { label: t.footerLinks.about, href: routes.home },
    { label: t.footerLinks.tools, href: routes.tools },
    { label: t.footerLinks.experience, href: routes.experience },
    { label: t.footerLinks.projects, href: routes.projects },
    { label: t.footerLinks.resume, href: routes.resume },
    { label: t.footerLinks.contact, href: routes.contact },
  ]

  const footerStackLinks = [
    { label: t.footerLinks.frameworks, href: routes.frameworks },
    { label: t.footerLinks.databases, href: routes.databases },
    { label: t.footerLinks.skills, href: routes.skills },
  ]

  return (
    <footer className="mt-20 border-t">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-6 py-12 md:grid-cols-2 lg:grid-cols-4 md:px-10">
        <Reveal variant="fade-up">
          <div className="space-y-3">
            <p className="text-lg font-semibold">{profileName}</p>
            <p className="text-sm text-muted-foreground">{profileTagline}</p>
            <p className="text-sm text-muted-foreground">
              © {footer.career_start} — {new Date().getFullYear()} {profileName}. {t.footer.rights}
            </p>
          </div>
        </Reveal>

        <Reveal variant="fade-up" delay={80}>
          <div>
            <p className="mb-3 text-sm font-medium">{t.footer.pages}</p>
            <FooterLinkList links={footerPageLinks} />
          </div>
        </Reveal>

        <Reveal variant="fade-up" delay={120}>
          <div>
            <p className="mb-3 text-sm font-medium">{t.footer.stack}</p>
            <FooterLinkList links={footerStackLinks} />
          </div>
        </Reveal>

        <Reveal variant="fade-up" delay={160}>
          <div>
            <p className="mb-3 text-sm font-medium">{t.footer.networks}</p>
            {links.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {links.map((link, i) => (
                  <Reveal key={link.key} as="span" variant="scale" delay={200 + i * 80}>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={formatSocialAriaLabel(link.icon, profileName)}
                      className="surface inline-flex size-10 cursor-pointer items-center justify-center rounded-full text-muted-foreground transition-[transform,colors] hover:-translate-y-0.5 hover:border-foreground/20 hover:text-foreground"
                      aria-label={formatSocialAriaLabel(link.icon, profileName)}
                    >
                      <AppIcon name={link.icon} className="size-4" />
                    </a>
                  </Reveal>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">—</p>
            )}
          </div>
        </Reveal>
      </div>
    </footer>
  )
}

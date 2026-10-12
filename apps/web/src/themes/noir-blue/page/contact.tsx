"use client"

import { ArrowUpRight, Send } from "lucide-react"

import { AppIcon } from "@/components/icons/app-icon"
import { Button } from "@/components/ui/button"
import { formatSocialAriaLabel, socialNetworkLabel } from "@/lib/social-label"
import { cn } from "@/lib/utils"
import type { ContactCopy, ContactResponse } from "@/themes/types"

import { Reveal } from "../reveal"
import { SectionEyebrow, SectionLead, SectionTitle } from "../section-heading"

const fieldClass =
  "w-full rounded-md border border-border/50 bg-background px-3.5 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/50 focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-60"

type ContactChannelItem = {
  key: string
  href: string
  icon: string
  title: string
  subtitle: string
  accentSubtitle?: boolean
  external?: boolean
}

function linkSubtitle(url: string) {
  try {
    if (url.startsWith("mailto:")) return url.replace("mailto:", "")
    const parsed = new URL(url)
    const host = parsed.hostname.replace(/^www\./, "")
    const path = parsed.pathname.replace(/\/$/, "")
    return path && path !== "/" ? `${host}${path}` : host
  } catch {
    return url
  }
}

function buildContactChannels(contact: ContactResponse, labels: ContactCopy): ContactChannelItem[] {
  const channels: ContactChannelItem[] = []

  if (contact.email) {
    channels.push({
      key: "email",
      href: `mailto:${contact.email}`,
      icon: "mail",
      title: labels.emailTitle,
      subtitle: contact.email,
      accentSubtitle: true,
    })
  }

  if (contact.whatsapp_url) {
    channels.push({
      key: "whatsapp",
      href: contact.whatsapp_url,
      icon: "whatsapp",
      title: labels.whatsappTitle,
      subtitle: labels.whatsappSubtitle,
      external: true,
    })
  }

  if (contact.linkedin) {
    channels.push({
      key: "linkedin",
      href: contact.linkedin,
      icon: "linkedin",
      title: labels.linkedinTitle,
      subtitle: labels.linkedinSubtitle,
      external: true,
    })
  }

  if (contact.github) {
    channels.push({
      key: "github",
      href: contact.github,
      icon: "github",
      title: socialNetworkLabel("github"),
      subtitle: linkSubtitle(contact.github),
      accentSubtitle: true,
      external: true,
    })
  }

  if (contact.gitlab) {
    channels.push({
      key: "gitlab",
      href: contact.gitlab,
      icon: "gitlab",
      title: socialNetworkLabel("gitlab"),
      subtitle: linkSubtitle(contact.gitlab),
      accentSubtitle: true,
      external: true,
    })
  }

  for (const network of contact.others) {
    if (!network.url) continue
    channels.push({
      key: `network-${network.id}`,
      href: network.url,
      icon: network.icon,
      title: socialNetworkLabel(network.icon),
      subtitle: linkSubtitle(network.url),
      external: true,
    })
  }

  return channels
}

function ContactField({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-xs font-medium text-foreground/80">{label}</span>
      {children}
    </label>
  )
}

function ContactChannel({
  channel,
  profileName,
}: {
  channel: ContactChannelItem
  profileName: string
}) {
  return (
    <a
      href={channel.href}
      target={channel.external ? "_blank" : undefined}
      rel={channel.external ? "noopener noreferrer" : undefined}
      aria-label={formatSocialAriaLabel(channel.icon, profileName)}
      title={`${channel.title} — ${channel.subtitle}`}
      className="group noir-tile flex cursor-pointer items-center justify-between gap-4 rounded-lg border border-border/40 bg-card/80 p-4 transition-colors hover:border-primary/50"
    >
      <span className="flex min-w-0 items-center gap-3">
        <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-md border border-border/50 bg-background text-muted-foreground transition-colors group-hover:text-foreground">
          <AppIcon name={channel.icon} className="size-4" />
        </span>
        <span className="min-w-0 text-left">
          <span className="block text-sm font-semibold text-foreground">{channel.title}</span>
          <span
            className={cn(
              "mt-0.5 block truncate text-xs",
              channel.accentSubtitle ? "font-mono text-primary" : "text-muted-foreground",
            )}
          >
            {channel.subtitle}
          </span>
        </span>
      </span>
      <ArrowUpRight className="size-4 shrink-0 text-muted-foreground/70 transition-colors group-hover:text-foreground" />
    </a>
  )
}

export const Contact = ({
  contact,
  copy,
  embedded = false,
}: {
  contact: ContactResponse
  copy: ContactCopy
  embedded?: boolean
}) => {
  const channels = buildContactChannels(contact, copy)

  const panel = (
    <Reveal variant="scale" duration={700}>
      <div
        id="contact-panel"
        className="rounded-xl border border-border/40 bg-card p-8 shadow-none md:p-10"
      >
        {!embedded ? (
          <Reveal variant="fade-up" className="mb-8 max-w-2xl space-y-3">
            <SectionEyebrow>04 / {copy.title}</SectionEyebrow>
            <SectionTitle className="text-3xl md:text-4xl">{copy.title}</SectionTitle>
            <SectionLead>{copy.description}</SectionLead>
          </Reveal>
        ) : null}

        <div
          className={cn(
            "grid grid-cols-1 gap-10 md:grid-cols-12",
            channels.length === 0 && "md:grid-cols-1",
          )}
        >
          <Reveal variant="fade-up" delay={100} className="md:col-span-7">
            <div className="mb-6">
              <h3 className="font-heading text-lg font-bold tracking-tight text-foreground">
                {copy.submit}
              </h3>
            </div>

            <form
              className="space-y-5"
              onSubmit={(event) => event.preventDefault()}
              aria-disabled
            >
              <ContactField label={copy.name}>
                <input
                  className={fieldClass}
                  type="text"
                  name="name"
                  placeholder={copy.namePlaceholder}
                  disabled
                />
              </ContactField>

              <ContactField label={copy.email}>
                <input
                  className={fieldClass}
                  type="email"
                  name="email"
                  placeholder={copy.emailPlaceholder}
                  disabled
                />
              </ContactField>

              <ContactField label={copy.message}>
                <textarea
                  className={cn(fieldClass, "min-h-32 resize-y")}
                  name="message"
                  placeholder={copy.messagePlaceholder}
                  rows={5}
                  disabled
                />
              </ContactField>

              <div className="space-y-3 pt-1">
                <Button type="submit" className="noir-cta gap-2 rounded-md" disabled>
                  {copy.submit}
                  <Send className="size-4" />
                </Button>
                <p className="text-[11px] text-muted-foreground">{copy.formDisabled}</p>
              </div>
            </form>
          </Reveal>

          {channels.length > 0 ? (
            <Reveal
              variant="fade-up"
              delay={180}
              className="flex flex-col border-t border-border/30 pt-8 md:col-span-5 md:border-t-0 md:border-l md:pt-0 md:pl-10"
            >
              <div className="mb-6">
                <h3 className="font-heading text-lg font-bold tracking-tight text-foreground">
                  {copy.otherChannels}
                </h3>
              </div>

              <div className="space-y-3">
                {channels.map((channel, i) => (
                  <Reveal key={channel.key} variant="scale" delay={220 + i * 60}>
                    <ContactChannel channel={channel} profileName={contact.profile_name} />
                  </Reveal>
                ))}
              </div>
            </Reveal>
          ) : null}
        </div>
      </div>
    </Reveal>
  )

  if (embedded) {
    return <section id="contact" className="relative z-0 scroll-mt-28">{panel}</section>
  }

  return (
    <section id="contact" className="relative z-0 scroll-mt-28 border-t border-border/30 pt-16 md:pt-24">
      {panel}
    </section>
  )
}

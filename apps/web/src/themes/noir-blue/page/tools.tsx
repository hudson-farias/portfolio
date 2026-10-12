"use client"

import { ExternalLink } from "lucide-react"

import { AppIcon } from "@/components/icons/app-icon"
import type { Dictionary } from "@/i18n/dictionary"
import type { Tool, ToolsCopy } from "@/themes/types"

import { Reveal } from "../reveal"
import { SectionCta } from "../section-cta"
import { SectionEyebrow, SectionLead, SectionTitle } from "../section-heading"

function ToolCard({
  tool,
  opensInNewTab,
}: {
  tool: Tool
  opensInNewTab: string
}) {
  const content = (
    <>
      <AppIcon name={tool.icon} className="mx-auto mb-2 size-8" />
      <span className="block text-sm font-medium">{tool.name}</span>
    </>
  )

  const className =
    "noir-tile rounded-lg border border-border/60 bg-card p-5 text-center transition-colors hover:border-primary"

  if (tool.url) {
    return (
      <a
        href={tool.url}
        target="_blank"
        rel="noopener noreferrer"
        className={`${className} cursor-pointer`}
        title={tool.name}
        aria-label={`${tool.name} ${opensInNewTab}`}
      >
        {content}
      </a>
    )
  }

  return (
    <article className={className} title={tool.name}>
      {content}
    </article>
  )
}

/** Dedicated-page tile: Stitch density (icon well + external hint). */
function DedicatedToolCard({
  tool,
  opensInNewTab,
}: {
  tool: Tool
  opensInNewTab: string
}) {
  const content = (
    <>
      {tool.url ? (
        <ExternalLink
          aria-hidden
          className="absolute top-3 right-3 size-3.5 text-muted-foreground opacity-0 transition-opacity duration-150 group-hover:text-primary group-hover:opacity-100"
        />
      ) : null}
      <div className="flex size-12 items-center justify-center rounded-lg bg-muted/40 transition-colors duration-200 group-hover:bg-primary/10">
        <AppIcon
          name={tool.icon}
          className="size-8 text-muted-foreground transition-colors duration-200 group-hover:text-primary"
        />
      </div>
      <span className="mt-3 text-base font-medium text-foreground transition-colors duration-200 group-hover:text-foreground">
        {tool.name}
      </span>
    </>
  )

  const className =
    "noir-tile group relative flex min-h-[140px] flex-col items-center justify-center rounded-lg border border-border/40 bg-card/60 p-6 text-center transition-all duration-200 hover:border-primary hover:bg-card"

  if (tool.url) {
    return (
      <a
        href={tool.url}
        target="_blank"
        rel="noopener noreferrer"
        className={`${className} cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary`}
        title={tool.name}
        aria-label={`${tool.name} ${opensInNewTab}`}
      >
        {content}
      </a>
    )
  }

  return (
    <article className={className} title={tool.name}>
      {content}
    </article>
  )
}

export const Tools = ({
  tools,
  copy,
  common,
  limit,
  ctaHref,
  ctaLabel,
  embedded = false,
}: {
  tools: Tool[]
  copy: ToolsCopy
  common: Pick<Dictionary["common"], "opensInNewTab">
  limit?: number
  ctaHref?: string
  ctaLabel?: string
  embedded?: boolean
}) => {
  const visibleTools = limit ? tools.slice(0, limit) : tools
  const resolvedCtaLabel = ctaLabel ?? copy.ctaAll

  if (embedded) {
    if (tools.length === 0) {
      return (
        <section id="tools" className="relative scroll-mt-28 py-4 md:py-6">
          <Reveal>
            <SectionLead>{copy.empty}</SectionLead>
          </Reveal>
        </section>
      )
    }

    return (
      <section id="tools" aria-label={copy.title} className="relative scroll-mt-28 py-4 md:py-6">
        <Reveal delay={120}>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {visibleTools.map((tool, index) => (
              <Reveal key={tool.id} variant="scale" delay={80 + index * 50}>
                <DedicatedToolCard tool={tool} opensInNewTab={common.opensInNewTab} />
              </Reveal>
            ))}
          </div>
        </Reveal>
      </section>
    )
  }

  if (tools.length === 0) {
    return (
      <section id="tools" className="scroll-mt-28 border-t border-border/30 pt-16 md:pt-24">
        <Reveal className="flex max-w-2xl flex-col gap-3">
          <SectionEyebrow>06 / {copy.title}</SectionEyebrow>
          <SectionTitle>{copy.title}</SectionTitle>
          <SectionLead>{copy.empty}</SectionLead>
        </Reveal>
      </section>
    )
  }

  return (
    <section id="tools" className="scroll-mt-28 border-t border-border/30 pt-16 md:pt-24">
      <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <Reveal>
          <SectionEyebrow>06 / {copy.title}</SectionEyebrow>
          <SectionTitle>{copy.title}</SectionTitle>
          <SectionLead className="mt-2 max-w-xl">{copy.description}</SectionLead>
        </Reveal>
        {ctaHref && tools.length > visibleTools.length ? (
          <Reveal delay={80}>
            <SectionCta href={ctaHref} label={resolvedCtaLabel} />
          </Reveal>
        ) : null}
      </div>

      <Reveal delay={120}>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {visibleTools.map((tool, index) => (
            <Reveal key={tool.id} variant="scale" delay={80 + index * 50}>
              <ToolCard tool={tool} opensInNewTab={common.opensInNewTab} />
            </Reveal>
          ))}
        </div>
      </Reveal>
    </section>
  )
}

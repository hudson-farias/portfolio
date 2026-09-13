"use client"

import { AppIcon } from "@/components/icons/app-icon"
import { Reveal } from "../reveal"
import { SectionCta } from "../section-cta"
import { useSiteLocale } from "@/i18n/site-locale-provider"
import type { Tool } from "@/types"

function ToolCard({ tool }: { tool: Tool }) {
  const { t } = useSiteLocale()
  const content = (
    <>
      <AppIcon name={tool.icon} className="size-6" />
      <span className="mt-3 text-sm font-medium">{tool.name}</span>
    </>
  )

  const interactiveClassName =
    "surface flex min-h-[120px] cursor-pointer flex-col items-center justify-center rounded-2xl p-6 text-center transition-[transform,colors,box-shadow] duration-300 ease-out hover:z-10 hover:scale-[1.03] hover:-translate-y-1 hover:border-foreground/20 hover:shadow-lg"

  const staticClassName =
    "surface surface-tile flex min-h-[120px] flex-col items-center justify-center rounded-2xl p-6 text-center transition-[transform,colors,box-shadow] duration-300 ease-out hover:z-10 hover:scale-[1.03] hover:-translate-y-1 hover:border-foreground/20 hover:shadow-lg"

  if (tool.url) {
    return (
      <a
        href={tool.url}
        target="_blank"
        rel="noopener noreferrer"
        className={interactiveClassName}
        title={tool.name}
        aria-label={`${tool.name} ${t.common.opensInNewTab}`}
      >
        {content}
      </a>
    )
  }

  return <article className={staticClassName} title={tool.name}>{content}</article>
}

export const Tools = ({
  tools,
  limit,
  ctaHref,
  ctaLabel,
  embedded = false,
}: {
  tools: Tool[]
  limit?: number
  ctaHref?: string
  ctaLabel?: string
  embedded?: boolean
}) => {
  const { t } = useSiteLocale()
  const visibleTools = limit ? tools.slice(0, limit) : tools
  const resolvedCtaLabel = ctaLabel ?? t.tools.ctaAll

  const heading = (
    <Reveal className="mx-auto max-w-2xl space-y-3 text-center">
      <h2 className="text-3xl font-bold tracking-tight md:text-4xl">{t.tools.title}</h2>
      <p className="text-muted-foreground">{t.tools.description}</p>
    </Reveal>
  )
  if (tools.length === 0) {
    return (
      <section id="tools" className="relative isolate z-0 overflow-hidden scroll-mt-28 space-y-10">
        <Reveal className="mx-auto max-w-2xl space-y-3 text-center">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">{t.tools.title}</h2>
          <p className="text-muted-foreground">{t.tools.empty}</p>
        </Reveal>
      </section>
    )
  }

  return (
    <section id="tools" className="relative isolate z-0 overflow-hidden scroll-mt-28 space-y-10">
      {!embedded ? heading : null}

      <Reveal delay={120}>
        <div className="mx-auto grid w-full max-w-6xl grid-cols-2 gap-4 px-6 sm:grid-cols-3 md:grid-cols-4 md:px-10 lg:grid-cols-5">
          {visibleTools.map((tool, index) => (
            <Reveal key={tool.id} variant="scale" delay={80 + index * 60}>
              <ToolCard tool={tool} />
            </Reveal>
          ))}
        </div>
        {ctaHref && tools.length > visibleTools.length ? (
          <SectionCta href={ctaHref} label={resolvedCtaLabel} />
        ) : null}
      </Reveal>
    </section>
  )
}

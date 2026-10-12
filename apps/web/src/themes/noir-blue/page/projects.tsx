"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react"

import { AppIcon } from "@/components/icons/app-icon"
import { Button } from "@/components/ui/button"
import type { Dictionary } from "@/i18n/dictionary"
import type { Project, ProjectsCopy } from "@/themes/types"

import { FrameworkBadges } from "../framework-badges"
import { Reveal } from "../reveal"
import { SectionCta } from "../section-cta"
import { SectionEyebrow, SectionLead, SectionTitle } from "../section-heading"

const GAP_PX = 16
const TRAILING_PX = 32

type ProjectsCommonCopy = Pick<Dictionary["common"], "noDescription" | "repository" | "demo">

function ProjectCard({
  project,
  common,
  cardWidth,
  className = "",
  dense = false,
}: {
  project: Project
  common: ProjectsCommonCopy
  cardWidth?: number
  className?: string
  /** Dedicated-page card: Stitch-style density (no image plane). */
  dense?: boolean
}) {
  const title = project.description ? `${project.name} — ${project.description}` : project.name

  return (
    <article
      data-project-card
      title={title}
      style={cardWidth && cardWidth > 0 ? { width: cardWidth } : undefined}
      className={`noir-tile group flex flex-col justify-between rounded-xl border border-border/40 bg-card p-6 transition-colors hover:border-primary/50 sm:p-7 ${
        dense ? "min-h-[220px]" : "min-h-[260px] sm:min-h-[280px]"
      } ${className}`}
    >
      <div className="flex flex-col gap-3">
        {!dense && project.image_url ? (
          <div className="relative mb-2 aspect-video w-full overflow-hidden rounded-md border border-border/40 bg-muted/20">
            <img
              src={project.image_url}
              alt={`Preview do projeto ${project.name}`}
              className="size-full object-cover"
              loading="lazy"
            />
          </div>
        ) : null}

        <h3 className="font-heading text-lg font-semibold tracking-tight text-foreground transition-colors group-hover:text-foreground sm:text-xl">
          {project.name}
        </h3>
        <p className="line-clamp-4 text-sm leading-relaxed text-muted-foreground">
          {project.description || common.noDescription}
        </p>
        {project.frameworks?.length ? (
          <div className="pt-1">
            <FrameworkBadges frameworks={project.frameworks} />
          </div>
        ) : null}
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-border/30 pt-4">
        {project.html_url ? (
          <a
            href={project.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex cursor-pointer items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground hover:underline"
          >
            <AppIcon name="github" className="size-4" />
            {common.repository}
          </a>
        ) : (
          <span />
        )}
        {project.homepage ? (
          <a
            href={project.homepage}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex cursor-pointer items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:underline"
          >
            {common.demo}
            <ExternalLink className="size-3.5" />
          </a>
        ) : null}
      </div>
    </article>
  )
}

export const Projects = ({
  projects,
  copy,
  common,
  limit,
  ctaHref,
  ctaLabel,
  layout = "carousel",
  embedded = false,
}: {
  projects: Project[]
  copy: ProjectsCopy
  common: ProjectsCommonCopy
  limit?: number
  ctaHref?: string
  ctaLabel?: string
  layout?: "carousel" | "grid"
  embedded?: boolean
}) => {
  const visibleProjects = limit ? projects.slice(0, limit) : projects
  const resolvedCtaLabel = ctaLabel ?? copy.ctaAll

  const [activePage, setActivePage] = useState(0)
  const [pageWidth, setPageWidth] = useState(0)
  const [cardWidth, setCardWidth] = useState(0)
  const [fitsAll, setFitsAll] = useState(false)
  const carouselRef = useRef<HTMLDivElement>(null)

  const total = visibleProjects.length

  const measure = useCallback(() => {
    const container = carouselRef.current
    if (!container) return

    const viewport = container.clientWidth
    const perView = viewport < 640 ? 1.2 : 1.5
    const gaps = Math.floor(perView) * GAP_PX
    const card = (viewport - gaps) / perView

    setPageWidth(viewport)
    setCardWidth(card)
    setFitsAll(container.scrollWidth <= container.clientWidth + 1)
  }, [total])

  const trackWidth = total * cardWidth + Math.max(0, total - 1) * GAP_PX + TRAILING_PX
  const totalPages =
    pageWidth > 0 && trackWidth > 0
      ? Math.max(1, Math.ceil((trackWidth - pageWidth) / pageWidth) + 1)
      : 1

  useEffect(() => {
    measure()
    const container = carouselRef.current
    if (!container) return
    const ro = new ResizeObserver(measure)
    ro.observe(container)
    return () => ro.disconnect()
  }, [measure, total])

  useEffect(() => {
    if (activePage >= totalPages) {
      setActivePage(Math.max(0, totalPages - 1))
    }
  }, [activePage, totalPages])

  const getScrollLeftForPage = useCallback(
    (page: number) => {
      const container = carouselRef.current
      if (!container || !pageWidth || !cardWidth) return 0

      const clamped = Math.max(0, Math.min(page, totalPages - 1))
      const maxScroll = Math.max(0, trackWidth - pageWidth)

      if (clamped === totalPages - 1) return maxScroll
      return Math.min(clamped * pageWidth, maxScroll)
    },
    [cardWidth, pageWidth, totalPages, trackWidth],
  )

  const goToPage = (page: number) => {
    if (!carouselRef.current) return
    const clamped = Math.max(0, Math.min(page, totalPages - 1))
    carouselRef.current.scrollTo({
      left: getScrollLeftForPage(clamped),
      behavior: "smooth",
    })
    setActivePage(clamped)
  }

  const goNext = () => {
    if (activePage >= totalPages - 1) return
    goToPage(activePage + 1)
  }

  const goPrevious = () => {
    if (activePage <= 0) return
    goToPage(activePage - 1)
  }

  const onCarouselScroll = () => {
    if (!carouselRef.current || !pageWidth) return

    const { scrollLeft } = carouselRef.current
    let nearest = 0
    let minDistance = Infinity

    for (let page = 0; page < totalPages; page++) {
      const target = getScrollLeftForPage(page)
      const distance = Math.abs(scrollLeft - target)
      if (distance < minDistance) {
        minDistance = distance
        nearest = page
      }
    }

    if (nearest !== activePage) setActivePage(nearest)
  }

  if (embedded) {
    if (total === 0) {
      return (
        <section id="projects" className="relative scroll-mt-28 py-4 md:py-6">
          <Reveal>
            <SectionLead>{copy.empty}</SectionLead>
          </Reveal>
        </section>
      )
    }

    return (
      <section id="projects" className="relative scroll-mt-28 py-4 md:py-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {visibleProjects.map((project, index) => (
            <Reveal key={`${project.id}-${index}`} delay={80 + index * 60}>
              <ProjectCard project={project} common={common} dense />
            </Reveal>
          ))}
        </div>
      </section>
    )
  }

  if (total === 0) {
    return (
      <section id="projects" className="scroll-mt-28 border-t border-border/30 pt-16 md:pt-24">
        <Reveal className="flex max-w-2xl flex-col gap-3">
          <SectionEyebrow>03 / {copy.title}</SectionEyebrow>
          <SectionTitle>{copy.title}</SectionTitle>
          <SectionLead>{copy.empty}</SectionLead>
        </Reveal>
      </section>
    )
  }

  const heading = (
    <div className="mb-10 flex flex-col justify-between gap-4 md:mb-14 md:flex-row md:items-end">
      <Reveal>
        <SectionEyebrow>03 / {copy.title}</SectionEyebrow>
        <SectionTitle>{copy.title}</SectionTitle>
        <SectionLead className="mt-2 max-w-xl">{copy.description}</SectionLead>
      </Reveal>
      {ctaHref && projects.length > visibleProjects.length ? (
        <Reveal delay={80}>
          <SectionCta href={ctaHref} label={resolvedCtaLabel} />
        </Reveal>
      ) : null}
    </div>
  )

  if (layout === "grid") {
    return (
      <section id="projects" className="scroll-mt-28 border-t border-border/30 pt-16 md:pt-24">
        {heading}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
          {visibleProjects.map((project, index) => (
            <Reveal key={`${project.id}-${index}`} delay={80 + index * 60}>
              <ProjectCard project={project} common={common} />
            </Reveal>
          ))}
        </div>
      </section>
    )
  }

  const showControls = !fitsAll && totalPages > 1

  return (
    <section id="projects" className="relative isolate scroll-mt-28 overflow-hidden border-t border-border/30 pt-16 md:pt-24">
      {heading}

      <Reveal delay={120} className="relative isolate overflow-hidden px-10 sm:px-12">
        {showControls ? (
          <>
            <Button
              type="button"
              size="icon"
              variant="outline"
              disabled={activePage <= 0}
              className="absolute top-1/2 left-0 z-[1] -translate-y-1/2 rounded-md bg-background shadow-sm"
              onClick={goPrevious}
              aria-label="Página anterior"
            >
              <ChevronLeft />
            </Button>
            <Button
              type="button"
              size="icon"
              variant="outline"
              disabled={activePage >= totalPages - 1}
              className="absolute top-1/2 right-0 z-[1] -translate-y-1/2 rounded-md bg-background shadow-sm"
              onClick={goNext}
              aria-label="Próxima página"
            >
              <ChevronRight />
            </Button>
          </>
        ) : null}

        <div
          ref={carouselRef}
          onScroll={onCarouselScroll}
          className="overflow-x-auto scroll-px-4 px-4 py-4 [-ms-overflow-style:none] [scrollbar-width:none] sm:scroll-px-6 sm:px-6 [&::-webkit-scrollbar]:hidden"
          aria-label="Carrossel de projetos"
        >
          <div className="flex w-max snap-x snap-mandatory gap-4 pr-8">
            {visibleProjects.map((project, index) => (
              <ProjectCard
                key={`${project.id}-${index}`}
                project={project}
                common={common}
                cardWidth={cardWidth}
                className="flex-none snap-start"
              />
            ))}
          </div>
        </div>
      </Reveal>

      {showControls ? (
        <Reveal delay={200} className="mt-6 flex items-center justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goToPage(i)}
              className={`h-2.5 cursor-pointer rounded-full transition-all ${
                i === activePage
                  ? "w-6 bg-primary"
                  : "w-2.5 bg-muted-foreground/40 hover:bg-muted-foreground/70"
              }`}
              aria-label={`Ir para página ${i + 1} de projetos`}
              {...(i === activePage ? { "aria-current": "true" as const } : {})}
            />
          ))}
        </Reveal>
      ) : null}
    </section>
  )
}

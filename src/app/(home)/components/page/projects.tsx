"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react"
import { Reveal } from "../reveal"
import { AppIcon } from "@/components/icons/app-icon"
import { Button } from "@/components/ui/button"
import { SectionCta } from "../section-cta"
import type { Project } from "@/types"

const GAP_PX = 16
const TRAILING_PX = 32

function ProjectCard({
  project,
  cardWidth,
  className = "",
}: {
  project: Project
  cardWidth?: number
  className?: string
}) {
  const title = project.description
    ? `${project.name} — ${project.description}`
    : project.name

  return (
    <article
      data-project-card
      title={title}
      style={cardWidth && cardWidth > 0 ? { width: cardWidth } : undefined}
      className={`surface surface-card-static relative z-0 flex min-h-[280px] flex-col overflow-hidden rounded-2xl transition-[transform,colors,box-shadow] duration-300 ease-out hover:z-10 hover:scale-[1.03] hover:-translate-y-1 hover:border-foreground/20 hover:shadow-lg sm:min-h-[320px] ${className}`}
    >
      {project.image_url ? (
        <div className="relative aspect-video w-full overflow-hidden border-b bg-muted/20">
          <img
            src={project.image_url}
            alt={`Preview do projeto ${project.name}`}
            className="size-full object-cover"
            loading="lazy"
          />
        </div>
      ) : null}

      <div className="flex flex-1 flex-col justify-between p-5 sm:p-6">
        <div className="space-y-2 sm:space-y-3">
          <h3 className="text-lg font-semibold sm:text-xl">{project.name}</h3>
          <p className="line-clamp-4 text-sm leading-relaxed text-muted-foreground">
            {project.description || "Sem descrição."}
          </p>
        </div>

        <div className="mt-4 flex flex-wrap gap-3 sm:mt-6">
          {project.html_url && (
            <a
              href={project.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex cursor-pointer items-center gap-1.5 text-sm font-medium transition-colors hover:underline"
            >
              <AppIcon name="github" className="size-4" />
              Repositório
            </a>
          )}
          {project.homepage && (
            <a
              href={project.homepage}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex cursor-pointer items-center gap-1.5 text-sm font-medium transition-colors hover:underline"
            >
              <ExternalLink className="size-4" />
              Demo
            </a>
          )}
        </div>
      </div>
    </article>
  )
}

export const Projects = ({
  projects,
  limit,
  ctaHref,
  ctaLabel = "Ver todos os projetos",
  layout = "carousel",
  embedded = false,
}: {
  projects: Project[]
  limit?: number
  ctaHref?: string
  ctaLabel?: string
  layout?: "carousel" | "grid"
  embedded?: boolean
}) => {
  const visibleProjects = limit ? projects.slice(0, limit) : projects

  const heading = (
    <Reveal className="mx-auto max-w-2xl space-y-3 text-center">
      <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Projetos</h2>
      <p className="text-muted-foreground">Seleção de trabalhos recentes.</p>
    </Reveal>
  )
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

  const trackWidth =
    total * cardWidth + Math.max(0, total - 1) * GAP_PX + TRAILING_PX
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

  if (total === 0) {
    return (
      <section id="projects" className="relative isolate z-0 overflow-hidden scroll-mt-28 space-y-10">
        <Reveal className="mx-auto max-w-2xl space-y-3 text-center">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Projetos</h2>
          <p className="text-muted-foreground">Em breve novos projetos por aqui.</p>
        </Reveal>
      </section>
    )
  }

  if (layout === "grid") {
    return (
      <section id="projects" className="relative isolate z-0 overflow-hidden scroll-mt-28 space-y-10">
        {!embedded ? heading : null}

        <div className="mx-auto grid w-full max-w-4xl gap-4 md:grid-cols-2">
          {visibleProjects.map((project, index) => (
            <Reveal key={project.id} variant="scale" delay={80 + index * 60}>
              <ProjectCard project={project} />
            </Reveal>
          ))}
        </div>
      </section>
    )
  }

  const showControls = !fitsAll && totalPages > 1

  return (
    <section id="projects" className="relative isolate z-0 overflow-hidden scroll-mt-28 space-y-10">
      {!embedded ? heading : null}

      <Reveal delay={120} className="relative isolate z-0 overflow-hidden px-10 sm:px-12">
        {showControls && (
          <>
            <Button
              type="button"
              size="icon"
              variant="outline"
              disabled={activePage <= 0}
              className="absolute top-1/2 left-0 z-[1] -translate-y-1/2 rounded-full bg-background shadow-sm"
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
              className="absolute top-1/2 right-0 z-[1] -translate-y-1/2 rounded-full bg-background shadow-sm"
              onClick={goNext}
              aria-label="Próxima página"
            >
              <ChevronRight />
            </Button>
          </>
        )}

        <div
          ref={carouselRef}
          onScroll={onCarouselScroll}
          className="overflow-x-auto scroll-px-4 px-4 py-4 [-ms-overflow-style:none] [scrollbar-width:none] sm:scroll-px-6 sm:px-6 [&::-webkit-scrollbar]:hidden"
          aria-label="Carrossel de projetos"
        >
          <div className="flex w-max gap-4 pr-8 snap-x snap-mandatory">
            {visibleProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                cardWidth={cardWidth}
                className="flex-none snap-start"
              />
            ))}
          </div>
        </div>

        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-10 z-[1] w-10 bg-gradient-to-r from-background to-transparent sm:left-12"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-10 z-[1] w-10 bg-gradient-to-l from-background to-transparent sm:right-12"
        />
      </Reveal>

      {showControls && (
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
      )}

      {ctaHref && projects.length > visibleProjects.length ? (
        <SectionCta href={ctaHref} label={ctaLabel} />
      ) : null}
    </section>
  )
}

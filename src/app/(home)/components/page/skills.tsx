"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Reveal } from "../reveal"
import { Button } from "@/components/ui/button"
import { AppIcon } from "@/components/icons/app-icon"
import type { SkillCategory } from "@/types"

const GAP_PX = 16
const TRAILING_PX = 32

const skillTileClassName =
  "surface flex min-h-[72px] flex-col items-center justify-center rounded-xl p-2.5 text-center transition-[transform,colors,box-shadow] duration-300 ease-out hover:z-10 hover:scale-[1.03] hover:-translate-y-0.5 hover:border-foreground/20 hover:shadow-md"

function SkillTile({ name, icon }: { name: string; icon: string }) {
  return (
    <article className={skillTileClassName}>
      <AppIcon name={icon} className="size-5" />
      <span className="mt-1.5 text-xs font-medium leading-tight">{name}</span>
    </article>
  )
}

function SkillCard({
  category,
  cardWidth,
  className = "",
}: {
  category: SkillCategory
  cardWidth?: number
  className?: string
}) {
  return (
    <article
      data-skill-card
      style={cardWidth && cardWidth > 0 ? { width: cardWidth } : undefined}
      className={`relative z-0 flex flex-col rounded-xl border border-border/50 bg-card/40 p-3 ${className}`}
    >
      <h3 className="text-sm font-semibold">{category.title}</h3>
      <div className="mt-2.5 grid grid-cols-2 gap-2">
        {category.skills.map((skill) => (
          <SkillTile key={skill.id} name={skill.name} icon={skill.icon} />
        ))}
      </div>
    </article>
  )
}

function SkillsCarousel({ categories }: { categories: SkillCategory[] }) {
  const [activePage, setActivePage] = useState(0)
  const [pageWidth, setPageWidth] = useState(0)
  const [cardWidth, setCardWidth] = useState(0)
  const [fitsAll, setFitsAll] = useState(false)
  const carouselRef = useRef<HTMLDivElement>(null)

  const total = categories.length

  const measure = useCallback(() => {
    const container = carouselRef.current
    if (!container) return

    const viewport = container.clientWidth
    const perView = 2.25
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

  const showControls = !fitsAll && totalPages > 1

  return (
    <>
      <div className="relative isolate z-0 overflow-hidden px-10 sm:px-12">
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
          aria-label="Carrossel de skills"
        >
          <div className="flex w-max gap-4 pr-8 snap-x snap-mandatory">
            {categories.map((category) => (
              <SkillCard
                key={category.title}
                category={category}
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
      </div>

      {showControls && (
        <div className="mt-6 flex items-center justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goToPage(i)}
              className={`h-2.5 rounded-full transition-all ${
                i === activePage
                  ? "w-6 bg-primary"
                  : "w-2.5 bg-muted-foreground/40 hover:bg-muted-foreground/70"
              }`}
              aria-label={`Ir para página ${i + 1} de skills`}
              {...(i === activePage ? { "aria-current": "true" as const } : {})}
            />
          ))}
        </div>
      )}
    </>
  )
}

export const Skills = ({ categories }: { categories: SkillCategory[] }) => {
  if (categories.length === 0) {
    return (
      <section id="skills" className="relative isolate z-0 overflow-hidden scroll-mt-28 space-y-10">
        <Reveal className="mx-auto max-w-2xl space-y-3 text-center">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Skills</h2>
          <p className="text-muted-foreground">Em breve novas skills por aqui.</p>
        </Reveal>
      </section>
    )
  }

  return (
    <section id="skills" className="relative isolate z-0 overflow-hidden scroll-mt-28 space-y-10">
      <Reveal className="mx-auto max-w-2xl space-y-3 text-center">
        <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Skills</h2>
        <p className="text-muted-foreground">
          Construindo interfaces limpas e código confiável.
        </p>
      </Reveal>

      <Reveal delay={120} className="relative isolate z-0 overflow-hidden">
        <SkillsCarousel categories={categories} />
      </Reveal>
    </section>
  )
}

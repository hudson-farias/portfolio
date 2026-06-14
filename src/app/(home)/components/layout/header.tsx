"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { SiteLogo } from "@/components/icons/site-logo"
import { ThemeToggle } from "@/components/theme/theme-toggle"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const navItems = [
  { label: "Home", href: "#hero" },
  { label: "Sobre", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Experiência", href: "#experience" },
  { label: "Projetos", href: "#projects" },
  { label: "Contato", href: "#contact" },
]

export const Header = () => {
  const [active, setActive] = useState("#hero")

  useEffect(() => {
    const sections = navItems
      .map((item) => document.querySelector(item.href))
      .filter(Boolean) as HTMLElement[]

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible?.target.id) setActive(`#${visible.target.id}`)
      },
      { rootMargin: "-112px 0px -50% 0px", threshold: [0, 0.15, 0.35, 0.5] },
    )

    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  return (
    <header className="land-slide-down sticky top-0 z-50 px-4 pt-4 md:px-6">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4">
        <Link
          href="#hero"
          className="flex shrink-0 items-center transition-opacity hover:opacity-85"
          aria-label="Início"
        >
          <SiteLogo className="h-8" />
        </Link>

        <nav className="surface hidden items-center gap-1 rounded-full p-1 backdrop-blur md:flex">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-full px-4 py-2 text-sm transition-colors",
                active === item.href
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="rounded-full" asChild>
            <Link href="/admin">Admin</Link>
          </Button>
          <ThemeToggle />
        </div>
      </div>

      <nav className="surface mx-auto mt-3 flex max-w-6xl gap-1 overflow-x-auto rounded-full p-1 backdrop-blur md:hidden">
        {navItems.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className={cn(
              "shrink-0 rounded-full px-3 py-2 text-xs transition-colors",
              active === item.href
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {item.label}
          </a>
        ))}
      </nav>
    </header>
  )
}

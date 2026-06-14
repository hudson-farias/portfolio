"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { SiteLogo } from "@/components/icons/site-logo"
import { ThemeToggle } from "@/components/theme/theme-toggle"
import { Button } from "@/components/ui/button"
import { navItems, routes } from "@/lib/site-routes"
import { cn } from "@/lib/utils"

function isRouteActive(pathname: string, href: string) {
  if (href.startsWith("/#")) return pathname === "/"
  return pathname === href
}

export const Header = () => {
  const pathname = usePathname()
  const [activeSection, setActiveSection] = useState("#hero")

  useEffect(() => {
    if (pathname !== "/") return

    const sections = navItems
      .filter((item) => item.href.startsWith("/#"))
      .map((item) => document.querySelector(item.href.slice(1)))
      .filter(Boolean) as HTMLElement[]

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible?.target.id) setActiveSection(`#${visible.target.id}`)
      },
      { rootMargin: "-112px 0px -50% 0px", threshold: [0, 0.15, 0.35, 0.5] },
    )

    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [pathname])

  function isActive(href: string) {
    if (pathname !== "/") return isRouteActive(pathname, href)
    if (href.startsWith("/#")) return activeSection === href.slice(1)
    return isRouteActive(pathname, href)
  }

  return (
    <header className="land-slide-down sticky top-0 z-50 border-b border-border/50 bg-background/75 px-4 pt-4 pb-3 backdrop-blur-xl backdrop-saturate-150 md:px-6 md:pb-4">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4">
        <Link
          href={routes.home}
          className="flex shrink-0 cursor-pointer items-center transition-opacity hover:opacity-85"
          aria-label="Início"
        >
          <SiteLogo className="h-8" />
        </Link>

        <nav className="hidden items-center gap-1 rounded-full border border-border/60 bg-card/70 p-1 shadow-sm backdrop-blur-md md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "cursor-pointer rounded-full px-4 py-2 text-sm transition-colors",
                isActive(item.href)
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="rounded-full" asChild>
            <Link href="/admin">Admin</Link>
          </Button>
          <ThemeToggle />
        </div>
      </div>

      <nav className="mx-auto mt-3 flex max-w-6xl gap-1 overflow-x-auto rounded-full border border-border/60 bg-card/70 p-1 shadow-sm backdrop-blur-md md:hidden">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "shrink-0 cursor-pointer rounded-full px-3 py-2 text-xs transition-colors",
              isActive(item.href)
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  )
}

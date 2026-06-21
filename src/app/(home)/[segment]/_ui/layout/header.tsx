"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { SiteLogo } from "@/components/icons/site-logo"
import { ThemeToggle } from "@/components/theme/theme-toggle"
import { Button } from "@/components/ui/button"
import { useSiteLocale } from "@/i18n/site-locale-provider"
import { switchLocalePath } from "@/i18n/routes"
import { cn } from "@/lib/utils"

export const Header = () => {
  const pathname = usePathname()
  const { locale, t, routes } = useSiteLocale()

  const navItems = [
    { label: t.nav.about, href: routes.home },
    { label: t.nav.experience, href: routes.experience },
    { label: t.nav.projects, href: routes.projects },
    { label: t.nav.frameworks, href: routes.frameworks },
    { label: t.nav.databases, href: routes.databases },
    { label: t.nav.tools, href: routes.tools },
    { label: t.nav.skills, href: routes.skills },
    { label: t.nav.contact, href: routes.contact },
  ]

  return (
    <header className="land-slide-down sticky top-0 z-50 border-b border-border/50 bg-background/75 px-4 pt-4 pb-3 backdrop-blur-xl backdrop-saturate-150 md:px-6 md:pb-4">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4">
        <Link
          href={routes.home}
          className="flex shrink-0 cursor-pointer items-center transition-opacity hover:opacity-85"
          aria-label={t.nav.home}
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
                pathname === item.href
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-1 rounded-full border border-border/60 bg-card/70 p-1 sm:flex">
            {(["pt", "en"] as const).map((code) => (
              <Link
                key={code}
                href={switchLocalePath(pathname, code)}
                className={cn(
                  "cursor-pointer rounded-full px-2.5 py-1 text-xs font-medium uppercase transition-colors",
                  locale === code
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {code}
              </Link>
            ))}
          </div>
          <Button variant="outline" size="sm" className="rounded-full" asChild>
            <Link href="/admin">{t.nav.admin}</Link>
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
              pathname === item.href
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

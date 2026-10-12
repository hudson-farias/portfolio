"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { ThemeToggle } from "@/components/theme/theme-toggle"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import type { ThemeId } from "@/themes"
import type { HeaderProps } from "@/themes/types"

function isContactNavItem(item: { label: string; href: string }) {
  return /contact|contato/i.test(item.href) || /contact|contato/i.test(item.label)
}

export const Header = ({
  homeHref,
  homeAriaLabel,
  navItems,
  locale,
  localeOptions,
  adminHref: _adminHref,
  adminLabel: _adminLabel,
  uiThemes,
  selectedThemeId,
  onUiThemeChange,
}: HeaderProps) => {
  const pathname = usePathname()
  const contactItem = navItems.find(isContactNavItem)
  const mainNavItems = navItems.filter((item) => !isContactNavItem(item))

  return (
    <header className="land-slide-down sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-[1280px] items-center justify-between gap-4 px-4 sm:px-8 lg:px-20">
        <Link
          href={homeHref}
          className="group flex shrink-0 cursor-pointer items-center gap-2"
          aria-label={homeAriaLabel}
        >
          <span className="font-heading text-lg font-bold tracking-tight transition-colors group-hover:text-primary">
            Hudson
          </span>
          <span className="size-1.5 rounded-full bg-primary" aria-hidden />
        </Link>

        <nav className="hidden items-center gap-7 text-sm md:flex">
          {mainNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "cursor-pointer transition-colors",
                pathname === item.href
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          {uiThemes.length > 0 ? (
            <div className="hidden lg:block">
              <Select
                value={selectedThemeId}
                onValueChange={(value) => onUiThemeChange?.(value as ThemeId)}
              >
                <SelectTrigger
                  size="sm"
                  aria-label="Tema da interface"
                  className="h-auto gap-1.5 rounded-md border-border/60 bg-card px-2.5 py-1 text-xs font-medium shadow-none"
                >
                  <span className="size-1.5 rounded-full bg-primary" aria-hidden />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent position="popper" align="end" className="min-w-36">
                  <SelectGroup>
                    {uiThemes.map((theme) => (
                      <SelectItem key={theme.id} value={theme.id} className="text-xs">
                        {theme.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          ) : null}

          {contactItem ? (
            <Button size="sm" className="rounded-md px-4" asChild>
              <Link href={contactItem.href}>{contactItem.label}</Link>
            </Button>
          ) : null}

          <ThemeToggle />

          <div className="flex items-center gap-0.5 rounded-md border border-border/60 px-1 py-0.5">
            {localeOptions.map((option) => (
              <Link
                key={option.code}
                href={option.href}
                className={cn(
                  "cursor-pointer rounded px-2 py-1 text-xs font-medium uppercase transition-colors",
                  locale === option.code
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {option.code}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <nav className="mx-auto flex max-w-[1280px] gap-1 overflow-x-auto px-4 pb-3 sm:px-8 md:hidden lg:px-20">
        {mainNavItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "shrink-0 cursor-pointer rounded-md px-3 py-1.5 text-xs transition-colors",
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

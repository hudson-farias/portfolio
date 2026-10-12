"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { SiteLogo } from "@/components/icons/site-logo"
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
import type { HeaderProps } from "@/themes/types"
import type { ThemeId } from "@/themes"

export const Header = ({
  homeHref,
  homeAriaLabel,
  navItems,
  locale,
  localeOptions,
  adminHref,
  adminLabel,
  uiThemes,
  selectedThemeId,
  onUiThemeChange,
}: HeaderProps) => {
  const pathname = usePathname()

  return (
    <header className="land-slide-down sticky top-0 z-50 border-b border-border/50 bg-background/75 px-4 pt-4 pb-3 backdrop-blur-xl backdrop-saturate-150 md:px-6 md:pb-4">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4">
        <Link
          href={homeHref}
          className="flex shrink-0 cursor-pointer items-center transition-opacity hover:opacity-85"
          aria-label={homeAriaLabel}
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
            {localeOptions.map((option) => (
              <Link
                key={option.code}
                href={option.href}
                className={cn(
                  "cursor-pointer rounded-full px-2.5 py-1 text-xs font-medium uppercase transition-colors",
                  locale === option.code
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {option.code}
              </Link>
            ))}
          </div>

          {uiThemes.length > 0 ? (
            <div className="hidden lg:block">
              <Select
                value={selectedThemeId}
                onValueChange={(value) => onUiThemeChange?.(value as ThemeId)}
              >
                <SelectTrigger
                  size="sm"
                  aria-label="Tema da interface"
                  className="h-auto rounded-full border-border/60 bg-card/70 px-2.5 py-1 text-xs font-medium shadow-none"
                >
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

          <Button variant="outline" size="sm" className="rounded-full" asChild>
            <Link href={adminHref}>{adminLabel}</Link>
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

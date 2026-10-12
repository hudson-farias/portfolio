"use client"

import type { ComponentType } from "react"
import { usePathname, useRouter } from "next/navigation"

import { locales } from "@/i18n/locales"
import { switchLocalePath } from "@/i18n/routes"
import type { ThemeId } from "@/themes"
import type { HeaderProps } from "@/themes/types"
import { setUiThemeId } from "@/themes/ui-theme"

type ThemeHeaderProps = Omit<HeaderProps, "localeOptions" | "onUiThemeChange"> & {
  Header: ComponentType<HeaderProps>
}

/** Client wrapper so locale switch hrefs preserve the current path and UI theme cookie can refresh. */
export function ThemeHeader({ Header, ...props }: ThemeHeaderProps) {
  const pathname = usePathname()
  const router = useRouter()

  const localeOptions = locales.map((code) => ({
    code,
    href: switchLocalePath(pathname, code),
  }))

  const onUiThemeChange = (themeId: ThemeId) => {
    setUiThemeId(themeId)
    router.refresh()
  }

  return <Header {...props} localeOptions={localeOptions} onUiThemeChange={onUiThemeChange} />
}

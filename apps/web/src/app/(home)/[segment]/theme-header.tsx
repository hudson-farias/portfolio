"use client"

import { usePathname } from "next/navigation"

import { Header } from "@/themes/default/layout/header"
import { locales } from "@/i18n/locales"
import { switchLocalePath } from "@/i18n/routes"
import type { HeaderProps } from "@/themes/types"

type ThemeHeaderProps = Omit<HeaderProps, "localeOptions">

/** Client wrapper so locale switch hrefs preserve the current path. */
export function ThemeHeader(props: ThemeHeaderProps) {
  const pathname = usePathname()

  const localeOptions = locales.map((code) => ({
    code,
    href: switchLocalePath(pathname, code),
  }))

  return <Header {...props} localeOptions={localeOptions} />
}

import type { ThemeId } from "@/themes"
import * as defaultTheme from "@/themes/default"
import * as noirBlueTheme from "@/themes/noir-blue"

export function resolveTheme(id: ThemeId) {
  switch (id) {
    case "noir-blue":
      return noirBlueTheme
    case "default":
    default:
      return defaultTheme
  }
}

export type ResolvedTheme = ReturnType<typeof resolveTheme>

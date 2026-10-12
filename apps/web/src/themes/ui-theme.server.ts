import { cookies } from "next/headers"

import { UI_THEME_COOKIE, parseThemeId } from "@/themes/ui-theme"
import type { ThemeId } from "@/themes"

export async function getUiThemeId(): Promise<ThemeId> {
  const cookieStore = await cookies()
  return parseThemeId(cookieStore.get(UI_THEME_COOKIE)?.value)
}

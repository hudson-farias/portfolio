import { themes, type ThemeId } from "@/themes"

export const UI_THEME_COOKIE = "portfolio-ui-theme"

export function parseThemeId(value: string | undefined | null): ThemeId {
  if (value && themes.some((theme) => theme.id === value)) {
    return value as ThemeId
  }
  return "default"
}

/** Client-only: writes the UI theme cookie. Caller should refresh afterwards. */
export function setUiThemeId(id: ThemeId): void {
  document.cookie = `${UI_THEME_COOKIE}=${encodeURIComponent(id)}; path=/; SameSite=Lax; Max-Age=31536000`
}

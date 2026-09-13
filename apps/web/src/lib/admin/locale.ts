export type LocaleCode = "pt" | "en"

export type Translations<T> = Partial<Record<LocaleCode, T>>

export const LOCALE_LABELS: Record<LocaleCode, string> = {
  pt: "PT",
  en: "EN",
}

export function emptyTranslations<T>(factory: () => T): Record<LocaleCode, T> {
  return {
    pt: factory(),
    en: factory(),
  }
}

export function hasPendingEn<T extends object>(translations: Translations<T>, keys: (keyof T)[]): boolean {
  const en = translations.en
  if (!en) return true

  return keys.some((key) => {
    const value = en[key]
    return value === undefined || value === null || String(value).trim() === ""
  })
}

export function resolveTranslations<T extends object>(
  keys: (keyof T)[],
  legacy: Partial<T>,
  translations: Translations<T> | undefined,
  empty: () => T,
): Record<LocaleCode, T> {
  const blank = empty()

  const pt = { ...blank }
  for (const key of keys) {
    pt[key] = (translations?.pt?.[key] ?? legacy[key] ?? blank[key]) as T[keyof T]
  }

  const en = { ...blank }
  for (const key of keys) {
    en[key] = (translations?.en?.[key] ?? blank[key]) as T[keyof T]
  }

  return { pt, en }
}

import type { Locale } from "./locales"
import type { Dictionary } from "./dictionary"

import en from "./messages/en.json"
import pt from "./messages/pt.json"

const dictionaries: Record<Locale, Dictionary> = { pt, en }

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  return dictionaries[locale]
}

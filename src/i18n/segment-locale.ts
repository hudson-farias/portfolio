import { notFound } from "next/navigation"

import { locales, type Locale } from "./locales"

export function isValidSegment(value: string): value is Locale {
  return locales.includes(value as Locale)
}

export async function resolveSegmentLocale(params: Promise<{ segment: string }>): Promise<Locale> {
  const { segment } = await params
  if (!isValidSegment(segment)) notFound()
  return segment
}

export function generateSegmentStaticParams() {
  return locales.map((segment) => ({ segment }))
}

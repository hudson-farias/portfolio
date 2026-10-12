import { headers } from "next/headers"
import { redirect } from "next/navigation"

import { negotiateLocale } from "@/i18n/seo"

export default async function HomeRootPage() {
  const h = await headers()
  const locale = negotiateLocale(h.get("accept-language"))
  redirect(`/${locale}`)
}

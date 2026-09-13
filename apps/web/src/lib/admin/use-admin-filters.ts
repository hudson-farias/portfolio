"use client"

import { useCallback, useEffect, useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

import { filtersToSearchParams, parsePageSearchParams } from "./query-string"

export function useAdminFilters<T extends Record<string, string>>(defaults: T) {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()

  const [filters, setFilters] = useState(() => parsePageSearchParams(searchParams, defaults))

  useEffect(() => {
    setFilters(parsePageSearchParams(searchParams, defaults))
  }, [searchParams, defaults])

  useEffect(() => {
    const nextQuery = filtersToSearchParams(filters)
    const currentQuery = searchParams.toString()

    if (nextQuery === currentQuery) return

    const href = nextQuery ? `${pathname}?${nextQuery}` : pathname
    router.replace(href, { scroll: false })
  }, [filters, pathname, router, searchParams])

  const clearFilters = useCallback(() => {
    setFilters(defaults)
  }, [defaults])

  return {
    filters,
    setFilters,
    clearFilters,
    queryString: searchParams.toString(),
  }
}

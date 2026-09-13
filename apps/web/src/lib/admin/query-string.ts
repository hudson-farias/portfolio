export function parsePageSearchParams<T extends Record<string, string>>(searchParams: URLSearchParams, defaults: T) {
  const result = { ...defaults }

  for (const key of Object.keys(defaults)) {
    const value = searchParams.get(key)
    if (value !== null) result[key as keyof T] = value as T[keyof T]
  }

  return result
}

export function filtersToSearchParams(filters: Record<string, string>) {
  const search = new URLSearchParams()

  for (const [key, value] of Object.entries(filters)) {
    if (value) search.set(key, value)
  }

  return search.toString()
}

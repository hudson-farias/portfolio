import type { IconProps } from "./types"

export const SvgIcon = ({ path, className }: IconProps & { path: string }) => {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d={path} />
    </svg>
  )
}

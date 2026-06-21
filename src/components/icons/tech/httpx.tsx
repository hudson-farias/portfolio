import { SvgIcon } from "../svg"
import type { IconProps } from "../types"

const PATH =
  "M12 2.25c-1.05 1.85-3.25 3.85-3.25 6.75 0 1.8 1.45 3.25 3.25 3.25s3.25-1.45 3.25-3.25c0-2.9-2.2-4.9-3.25-6.75zm-4.75 8.5c-2.35.75-4 2.85-4 5.25 0 .55.45 1 1 1h3.75v-6.25zm9.5 0v6.25H20c.55 0 1-.45 1-1 0-2.4-1.65-4.5-4-5.25z"

export const HttpxIcon = ({ className }: IconProps) => {
  return <SvgIcon path={PATH} className={className} />
}

import { SvgIcon } from "../svg"
import type { IconProps } from "../types"

const PATH =
  "M12 2 4 6.5v11L12 22l8-4.5v-11L12 2zm0 2.2 5.5 3.1L12 10.4 6.5 7.3 12 4.2zM6.5 8.6v7.8L11 19v-7.8L6.5 8.6zm11 0L13 11.2V19l4.5-2.6V8.6z"

export const AsdfIcon = ({ className }: IconProps) => {
  return <SvgIcon path={PATH} className={className} />
}

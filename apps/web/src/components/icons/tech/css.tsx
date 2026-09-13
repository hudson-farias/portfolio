import { SvgIcon } from "../svg"
import type { IconProps } from "../types"

const PATH =
  "M1.5 0h21l-1.91 21.563L11.977 24l-8.565-2.438L1.5 0zm17.09 4.413L5.41 4.41l.213 2.622 10.125.058-.255 2.716H6.878l.24 2.573h6.182l-.366 3.523-2.91.804-2.955-.81-.188-2.11h-2.61l.29 3.855L12 19.288l5.373-1.53L18.59 4.414z"

export const CssIcon = ({ className }: IconProps) => {
  return <SvgIcon path={PATH} className={className} />
}

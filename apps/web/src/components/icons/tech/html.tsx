import { SvgIcon } from "../svg"
import type { IconProps } from "../types"

const PATH =
  "M1.5 0h21l-1.91 21.563L11.977 24l-8.564-2.438L1.5 0zm17.09 4.413L5.41 4.41l.213 2.622h10.125l-.255 2.716h-6.64l.24 2.573h6.182l-.366 3.523-2.91.804-2.955-.81-.188-2.11H6.64l.33 4.171L12 19.351l5.86-1.594.795-8.76H8.531l-.182-2.016h8.865l.114-1.293H5.41l.213-2.622h13.18z"

export const HtmlIcon = ({ className }: IconProps) => {
  return <SvgIcon path={PATH} className={className} />
}

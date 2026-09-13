import { Globe } from "lucide-react"

import { iconMap } from "./map"
import type { IconProps } from "./types"

export const AppIcon = ({ name, className }: IconProps & { name: string }) => {
  const Icon = iconMap[name.toLowerCase()] ?? Globe
  return <Icon className={className} />
}

export { GithubIcon } from "./brands/github"

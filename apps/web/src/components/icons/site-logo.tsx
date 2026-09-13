import { cn } from "@/lib/utils"

type SiteLogoProps = {
  className?: string
}

const LOGO_FONT = "ui-sans-serif, system-ui, sans-serif"

/** Marca horizontal <HF/> — sem container (círculo/caixa). */
export const SiteLogo = ({ className }: SiteLogoProps) => {
  return (
    <svg
      viewBox="0 0 72 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("h-7 w-auto shrink-0", className)}
      aria-hidden
    >
      <text
        x="0"
        y="21"
        fontSize="20"
        fontWeight="700"
        fontFamily={LOGO_FONT}
        className="fill-primary"
      >
        {"<"}
      </text>
      <text
        x="12"
        y="21"
        fontSize="20"
        fontWeight="700"
        fontFamily={LOGO_FONT}
        className="fill-foreground"
      >
        H
      </text>
      <text
        x="26"
        y="21"
        fontSize="20"
        fontWeight="700"
        fontFamily={LOGO_FONT}
        className="fill-primary"
      >
        F
      </text>
      <text
        x="40"
        y="21"
        fontSize="20"
        fontWeight="700"
        fontFamily={LOGO_FONT}
        className="fill-primary"
      >
        /
      </text>
      <text
        x="48"
        y="21"
        fontSize="20"
        fontWeight="700"
        fontFamily={LOGO_FONT}
        className="fill-primary"
      >
        {">"}
      </text>
    </svg>
  )
}

import { cn } from "@/lib/utils"

export function AdminTable({ children, className, scrollable = false }: { children: React.ReactNode; className?: string; scrollable?: boolean }) {
  return (
    <div className={cn("w-full", scrollable && "overflow-x-auto")}>
      <table className={cn("w-full text-left text-sm", className)}>{children}</table>
    </div>
  )
}

export function adminTh(className?: string) {
  return cn("pb-3 pr-4 font-medium", className)
}

export function adminTd(className?: string) {
  return cn("py-3 pr-4 align-top", className)
}

export const adminActionsCol = "w-24 whitespace-nowrap"

export const adminHeadRow = "border-b border-zinc-200 text-zinc-500 dark:border-zinc-800"
export const adminBodyRow = "border-b border-zinc-100 last:border-0 dark:border-zinc-800/80"

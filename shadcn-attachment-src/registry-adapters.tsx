import type { ComponentProps } from "react"
import { clsx, type ClassValue } from "clsx"
import { LoaderCircleIcon } from "lucide-react"
import { twMerge } from "tailwind-merge"

export function cn(...values: ClassValue[]) {
  return twMerge(clsx(values))
}

type IconProps = ComponentProps<typeof LoaderCircleIcon> & {
  lucide?: string
  tabler?: string
  hugeicons?: string
  phosphor?: string
  remixicon?: string
}

export function IconPlaceholder({ lucide, tabler, hugeicons, phosphor, remixicon, ...props }: IconProps) {
  return <LoaderCircleIcon {...props} />
}

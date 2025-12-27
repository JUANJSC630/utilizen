import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-[color,box-shadow] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0 outline-none focus-visible:border-[var(--accent-primary)] focus-visible:ring-[var(--accent-primary)]/20 focus-visible:ring-[3px]",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--accent-primary)] text-white shadow-xs hover:bg-[var(--accent-hover)]",
        destructive:
          "bg-[var(--error)] text-white shadow-xs hover:bg-[var(--error)]/90 focus-visible:ring-[var(--error)]/20",
        outline:
          "border border-[var(--border-default)] bg-[var(--bg-primary)] text-[var(--text-primary)] shadow-xs hover:bg-[var(--bg-tertiary)]",
        secondary:
          "bg-[var(--bg-secondary)] text-[var(--text-primary)] shadow-xs hover:bg-[var(--bg-tertiary)]",
        ghost: "hover:bg-[var(--bg-tertiary)] text-[var(--text-primary)]",
        link: "text-[var(--accent-primary)] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }

"use client"

import { Button } from "@/components/ui/button"
import { useHelperStatus } from "@/hooks/use-helper-status"
import type { HelperConnectionState } from "@/lib/helper"
import { cn } from "@/lib/utils"

function labelFor(state: HelperConnectionState): string {
  switch (state) {
    case "checking":
      return "Checking helper…"
    case "connected":
      return "Helper connected"
    case "not-connected":
      return "Helper not connected"
  }
}

function dotClass(state: HelperConnectionState): string {
  switch (state) {
    case "checking":
      return "bg-muted-foreground/50"
    case "connected":
      return "bg-emerald-500"
    case "not-connected":
      return "bg-destructive"
  }
}

/** Dev-only surface: shows whether the local helper answers `/health`. */
export function HelperStatus() {
  const state = useHelperStatus()

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className="pointer-events-none gap-2 font-normal"
      aria-live="polite"
      aria-label={labelFor(state)}
    >
      <span
        className={cn("size-2 shrink-0 rounded-full", dotClass(state))}
        aria-hidden
      />
      {labelFor(state)}
    </Button>
  )
}

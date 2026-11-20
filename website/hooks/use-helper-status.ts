"use client"

import { useEffect, useState } from "react"

import {
  checkHelperHealth,
  type HelperConnectionState,
} from "@/lib/helper"

const POLL_MS = 5_000

/** Polls the local helper `/health` endpoint. Development smoke only. */
export function useHelperStatus(): HelperConnectionState {
  const [state, setState] = useState<HelperConnectionState>("checking")

  useEffect(() => {
    let cancelled = false
    const controller = new AbortController()

    async function poll() {
      const ok = await checkHelperHealth(undefined, controller.signal)
      if (!cancelled) setState(ok ? "connected" : "not-connected")
    }

    void poll()
    const id = window.setInterval(() => void poll(), POLL_MS)

    return () => {
      cancelled = true
      controller.abort()
      window.clearInterval(id)
    }
  }, [])

  return state
}

/** Local helper base URL (browser → localhost). Override with NEXT_PUBLIC_HELPER_URL. */
export const HELPER_BASE_URL =
  process.env.NEXT_PUBLIC_HELPER_URL ?? "http://127.0.0.1:8000"

export type HelperConnectionState = "checking" | "connected" | "not-connected"

export async function checkHelperHealth(
  baseUrl: string = HELPER_BASE_URL,
  signal?: AbortSignal
): Promise<boolean> {
  try {
    const res = await fetch(`${baseUrl}/health`, {
      method: "GET",
      cache: "no-store",
      signal,
    })
    if (!res.ok) return false
    const body: unknown = await res.json()
    return (
      typeof body === "object" &&
      body !== null &&
      "status" in body &&
      (body as { status: unknown }).status === "ok"
    )
  } catch {
    return false
  }
}

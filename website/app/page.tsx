import { HelperStatus } from "@/components/helper-status"

export default function Page() {
  const showHelperStatus = process.env.NODE_ENV === "development"

  return (
    <div className="flex min-h-svh flex-col">
      <header className="flex items-center justify-between gap-4 border-b border-border px-6 py-3">
        <p className="font-heading text-sm font-medium tracking-tight">TTS</p>
        {showHelperStatus ? <HelperStatus /> : null}
      </header>
      <main className="flex flex-1 flex-col gap-2 p-6 text-sm text-muted-foreground">
        <h1 className="font-heading text-foreground text-base font-medium">
          Home
        </h1>
        <p>Helper connection status appears in the header during development.</p>
      </main>
    </div>
  )
}

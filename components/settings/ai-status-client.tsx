"use client"
import { useActionState } from "react"
import { aiHealthCheck, type AIHealth } from "@/app/settings/ai/actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, CheckCircle2, CircleAlert } from "lucide-react"

export function AIStatusClient() {
  const [state, action, isPending] = useActionState<AIHealth | null, FormData>(async () => aiHealthCheck(), null)

  return (
    <Card>
      <CardContent className="py-4">
        <form action={action} className="flex items-center gap-3">
          <Button type="submit" disabled={isPending}>
            {isPending ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 className="size-4 animate-spin" />
                {"Verificando conexión AI"}
              </span>
            ) : (
              "Probar conexión AI"
            )}
          </Button>

          {state ? (
            state.ok ? (
              <Badge variant="secondary" className="inline-flex items-center gap-1 bg-green-100 text-green-800">
                <CheckCircle2 className="size-4" />
                {"OK · " + state.model + " · " + state.latencyMs + "ms"}
              </Badge>
            ) : (
              <Badge variant="secondary" className="inline-flex items-center gap-1 bg-amber-100 text-amber-800">
                <CircleAlert className="size-4" />
                {state.reason === "MISSING_API_KEY" ? "Falta XAI_API_KEY" : "Error de solicitud"}
              </Badge>
            )
          ) : null}
        </form>

        {state && !state.ok && state.error ? <p className="mt-3 text-sm text-muted-foreground">{state.error}</p> : null}
      </CardContent>
    </Card>
  )
}

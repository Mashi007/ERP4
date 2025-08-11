"use client"

import { useActionState } from "react"
import { askClientAI } from "@/app/clientes/[id]/actions"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export function ClientAISummary({ clientId }: { clientId: string }) {
  const [state, formAction, isPending] = useActionState(askClientAI as any, {
    ok: false,
    answer: "",
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Resumen con IA</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-3">
          <input type="hidden" name="clientId" value={clientId} />
          <Input
            name="q"
            placeholder="Ejemplo: Resume el estado actual y riesgos del cliente"
            aria-label="Pregunta para IA"
          />
          <Button type="submit" disabled={isPending}>
            {isPending ? "Generando..." : "Generar informe"}
          </Button>
        </form>

        {state?.answer ? (
          <div className="mt-4">
            <Textarea readOnly value={state.answer} className="min-h-[180px]" />
          </div>
        ) : null}
      </CardContent>
    </Card>
  )
}

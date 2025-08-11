import { getAICoverage } from "./actions"
import { AIStatusClient } from "@/components/settings/ai-status-client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CheckCircle2, CircleAlert, Cpu } from "lucide-react"

export const metadata = {
  title: "AI Overview",
}

export default async function AIOverviewPage() {
  const { isConfigured, features } = await getAICoverage()

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Cpu className="size-6 text-muted-foreground" />
          <h1 className="text-xl font-semibold">{"Automatización con IA"}</h1>
        </div>
        <Badge className={isConfigured ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"}>
          {isConfigured ? (
            <span className="inline-flex items-center gap-1">
              <CheckCircle2 className="size-4" /> {"xAI configurado"}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1">
              <CircleAlert className="size-4" /> {"Modo fallback (sin API key)"}
            </span>
          )}
        </Badge>
      </div>

      <AIStatusClient />

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{"Cobertura de IA en el sistema"}</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {features.map((f) => (
            <div
              key={f.key}
              className="flex items-center justify-between rounded-md border p-3"
              data-testid={`ai-feature-${f.key}`}
            >
              <div>
                <div className="font-medium">{f.title}</div>
                <div className="text-xs text-muted-foreground">{`${f.file} · ${f.fn}`}</div>
              </div>
              <Badge
                className={f.status === "active" ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"}
                data-testid={`ai-feature-status-${f.key}`}
              >
                {f.status === "active" ? "Activo (xAI)" : "Fallback"}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{"Siguientes pasos sugeridos"}</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-inside list-disc space-y-2 text-sm text-muted-foreground">
            <li>{'Validar conectividad periódicamente con el botón "Probar conexión AI".'}</li>
            <li>{'Donde veas "Fallback", añade XAI_API_KEY o revisa permisos/red.'}</li>
            <li>{"Opcional: Instrumentar métricas (latencia y tasa de error) por feature."}</li>
            <li>{"Añadir pruebas e2e que verifiquen el comportamiento con y sin IA."}</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}

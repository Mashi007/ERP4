import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import PropuestasUploader from "@/components/servicios/propuestas-uploader"

export default function PropuestasPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Propuestas</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-sm text-muted-foreground">Aquí podrás gestionar tus propuestas de servicios.</p>
        <Button size="sm" disabled>
          Nueva Propuesta (próximamente)
        </Button>
        <PropuestasUploader />
      </CardContent>
    </Card>
  )
}

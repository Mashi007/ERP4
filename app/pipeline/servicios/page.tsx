import { Suspense } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import ServiciosClient from "@/components/pipeline/servicios-client"

export default async function ServiciosPage() {
  return (
    <main className="p-4 sm:p-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl sm:text-2xl">Servicios</CardTitle>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<div className="h-24 animate-pulse rounded-md bg-gray-100" />}>
            <ServiciosClient />
          </Suspense>
        </CardContent>
      </Card>
    </main>
  )
}

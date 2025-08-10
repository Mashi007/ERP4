import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { HelpCircle, MoreHorizontal, BarChart3, TrendingUp } from "lucide-react"

export default function Dashboard() {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="grid gap-6">
        {/* Primera fila - Métricas principales */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {/* Revenue won */}
          <Card className="relative">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Ingresos ganados</CardTitle>
              <div className="flex items-center space-x-1">
                <span className="text-xs text-gray-400">123</span>
                <BarChart3 className="h-4 w-4 text-gray-400" />
                <TrendingUp className="h-4 w-4 text-gray-400" />
                <MoreHorizontal className="h-4 w-4 text-gray-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold text-green-600">$ 12.3K</div>
                <HelpCircle className="h-4 w-4 text-gray-400" />
              </div>
            </CardContent>
          </Card>

          {/* Revenue lost */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Ingresos perdidos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">$ 6.2K</div>
            </CardContent>
          </Card>

          {/* Open deal value by stage */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-600">
                Valor de oportunidades abiertas por etapa
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center mb-4">
                {/* Funnel Chart Simulation */}
                <div className="relative">
                  <div className="w-48 h-32 relative">
                    <div className="absolute top-0 w-full h-6 bg-blue-500 rounded-t-lg"></div>
                    <div className="absolute top-6 left-2 right-2 h-5 bg-pink-400"></div>
                    <div className="absolute top-11 left-4 right-4 h-4 bg-purple-400"></div>
                    <div className="absolute top-15 left-6 right-6 h-3 bg-orange-400 rounded-b"></div>
                  </div>
                </div>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-blue-500 rounded"></div>
                    <span>Nuevo: $ 9.6K (46.83%)</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-pink-400 rounded"></div>
                    <span>Calificación: $ 4.2K (20.49%)</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-purple-400 rounded"></div>
                    <span>Descubrimiento: $ 3.5K (17.07%)</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-orange-400 rounded"></div>
                    <span>Negociación: $ 3.2K (15.61%)</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Segunda fila */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {/* Deal win/loss percentage */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-600">
                Porcentaje de oportunidades ganadas/perdidas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Ganado</span>
                  <span className="font-medium">66.67%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: "66.67%" }}></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Perdido</span>
                  <span className="font-medium">33.33%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-red-500 h-2 rounded-full" style={{ width: "33.33%" }}></div>
                </div>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>10%</span>
                <span>20%</span>
                <span>30%</span>
                <span>40%</span>
                <span>50%</span>
                <span>60%</span>
                <span>70%</span>
                <span>80%</span>
              </div>
              <div className="text-center text-xs text-gray-500">Porcentaje</div>
            </CardContent>
          </Card>

          {/* Tasks by owner */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-600">Tareas por propietario</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-center space-x-4 h-24 mb-4">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-16 bg-blue-500 rounded-t"></div>
                  <span className="text-xs mt-1">2</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-8 h-12 bg-blue-300 rounded-t"></div>
                  <span className="text-xs mt-1">1</span>
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm font-medium">Daniel Casañas</div>
                <div className="text-xs text-gray-500">Propietario de tareas</div>
              </div>
              <div className="flex items-center justify-center space-x-4 mt-2 text-xs">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-blue-500 rounded"></div>
                  <span>Tareas abiertas</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-blue-300 rounded"></div>
                  <span>Tareas completadas</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contacts by sales owner */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-600">Contactos por propietario de ventas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-center space-x-8 h-24 mb-4">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-20 bg-blue-500 rounded-t"></div>
                  <span className="text-xs mt-1">10</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-12 h-10 bg-blue-500 rounded-t"></div>
                  <span className="text-xs mt-1">5</span>
                </div>
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>Daniel Casañas</span>
                <span>---</span>
              </div>
              <div className="text-center text-xs text-gray-500 mt-1">Propietario de ventas</div>
              <div className="text-right text-sm text-gray-400 mt-2">15</div>
              <div className="text-right text-xs text-gray-500">Total de Contactos</div>
            </CardContent>
          </Card>

          {/* Revenue won by source */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-600">Ingresos ganados por fuente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center mb-4">
                {/* Pie Chart Simulation */}
                <div className="relative w-24 h-24">
                  <div
                    className="absolute inset-0 rounded-full"
                    style={{
                      background: `conic-gradient(
                      #2563eb 0deg 210deg,
                      #60a5fa 210deg 298deg,
                      #fb923c 298deg 360deg
                    )`,
                    }}
                  ></div>
                  <div className="absolute inset-2 bg-white rounded-full"></div>
                </div>
              </div>
              <div className="space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-600 rounded"></div>
                    <span>Correo electrónico: $ 7.2K (58.54%)</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-400 rounded"></div>
                    <span>Búsqueda org...: $ 3K (24.39%)</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-orange-400 rounded"></div>
                    <span>Búsqueda pag...: $ 2.1K (17.07%)</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tercera fila */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Forecasted revenue by deal stage */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-600">Ingresos pronosticados por etapa</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-center space-x-8 h-32 mb-4">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-2 bg-gray-300 rounded-t"></div>
                  <span className="text-xs mt-1">1</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-8 h-4 bg-gray-300 rounded-t"></div>
                  <span className="text-xs mt-1">2</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-8 h-24 bg-green-500 rounded-t"></div>
                  <span className="text-xs mt-1">3</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 bg-blue-500 rounded-t"></div>
                  <span className="text-xs mt-1">4</span>
                </div>
              </div>
              <div className="text-center text-xs text-gray-500 mb-4">Fecha de cierre esperada - Trimestre del año</div>
              <div className="flex items-center justify-center space-x-4 text-xs">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-purple-400 rounded"></div>
                  <span>Descubrimiento</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-orange-400 rounded"></div>
                  <span>Negociación</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-blue-500 rounded"></div>
                  <span>Nuevo</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-pink-400 rounded"></div>
                  <span>Calificación</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-500 rounded"></div>
                  <span>Ganado</span>
                </div>
              </div>
              <div className="text-left text-xs text-gray-500 mt-4">$ 10K</div>
              <div className="text-left text-xs text-gray-500">Ingresos pronosticados</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

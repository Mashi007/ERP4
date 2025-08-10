import { Calendar, RefreshCw } from 'lucide-react'

export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <Calendar className="h-8 w-8 mx-auto mb-4 text-blue-600" />
        <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-4 text-blue-600" />
        <p className="text-gray-600">Cargando configuración de calendario...</p>
      </div>
    </div>
  )
}

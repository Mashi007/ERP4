import type { ReactNode } from "react"
import { PipelineSubnav } from "@/components/pipeline/pipeline-subnav"

export default function PipelineLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="px-6 pt-6">
        <div className="flex items-end justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Ventas</h1>
            <p className="text-gray-600">Gestiona tu pipeline y oportunidades</p>
          </div>
        </div>
        <PipelineSubnav />
      </header>
      <main className="p-6">{children}</main>
    </div>
  )
}

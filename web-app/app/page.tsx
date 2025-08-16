/* eslint-disable @typescript-eslint/no-unused-vars */
import { StatisticsCards } from '@/components/dashboard/statistics-cards'
import { RecentAssessments } from '@/components/dashboard/recent-assessments'
import { AssessmentCharts } from '@/components/dashboard/assessment-charts'
import { AssessmentsByTypeChart } from '@/components/dashboard/assessments-by-type-chart'
import { MonthlyTrendChart } from '@/components/dashboard/monthly-trend-chart'
import { Button } from '@/components/ui/button'
import { MapPin } from 'lucide-react'
import Link from 'next/link'

export default function Dashboard() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>
      
      {/* Estatísticas */}
      <StatisticsCards />
      
      {/* Mapa de Avaliações */}
      <div className="grid gap-4">
        <div className="">
          <div className="bg-white p-6 rounded-lg border shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Mapa de Avaliações</h3>
              <MapPin className="h-5 w-5 text-gray-500" />
            </div>
            <p className="text-gray-600 mb-4">
              Visualize todas as avaliações de desastres em um mapa interativo com informações detalhadas de localização e severidade.
            </p>
            <Link href="/mapa">
              <Button className="w-full">
                <MapPin className="mr-2 h-4 w-4" />
                Ver Avaliações no Mapa
              </Button>
            </Link>
          </div>
        </div>
      </div>
      
      {/* Gráficos */}
      <AssessmentCharts />

      {/* Avaliações Recentes - linha final */}
      <div>
        <RecentAssessments />
      </div>
    </div>
  )
}
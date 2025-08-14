import { StatisticsCards } from '@/components/dashboard/statistics-cards'
import { AssessmentMap } from '@/components/dashboard/assessment-map'
import { RecentAssessments } from '@/components/dashboard/recent-assessments'
import { AssessmentCharts } from '@/components/dashboard/assessment-charts'
import { AssessmentsByTypeChart } from '@/components/dashboard/assessments-by-type-chart'
import { MonthlyTrendChart } from '@/components/dashboard/monthly-trend-chart'

export default function Dashboard() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>
      
      {/* Estatísticas */}
      <StatisticsCards />
      
      {/* Mapa e Avaliações Recentes */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4">
          <AssessmentMap />
        </div>
        
        <div className="col-span-3">
          <RecentAssessments />
        </div>
      </div>
      
      {/* Gráficos */}
      <AssessmentCharts />
    </div>
  )
}
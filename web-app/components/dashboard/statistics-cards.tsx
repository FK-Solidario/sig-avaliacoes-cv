'use client'

import { useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useStatisticsStore } from '@/store/statistics'
import { AlertTriangle, CheckCircle, Clock, FileText } from 'lucide-react'

export function StatisticsCards() {
  const { statistics, loading, error, fetchStatistics } = useStatisticsStore()

  useEffect(() => {
    fetchStatistics()
  }, [])

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 bg-gray-200 rounded w-20"></div>
              <div className="h-4 w-4 bg-gray-200 rounded"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-24"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="col-span-full">
          <CardContent className="pt-6">
            <p className="text-red-500">Erro ao carregar estatísticas: {error}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!statistics) {
    return null
  }

  const cards = [
    {
      title: 'Total de Avaliações',
      value: statistics.total_avaliacoes,
      icon: FileText,
      color: 'text-blue-600'
    },
    {
      title: 'Danos Parciais',
      value: statistics.estatisticas_nivel_danos?.parcial || 0,
      icon: Clock,
      color: 'text-yellow-600'
    },
    {
      title: 'Danos Graves',
      value: statistics.estatisticas_nivel_danos?.grave || 0,
      icon: CheckCircle,
      color: 'text-orange-600'
    },
    {
      title: 'Danos Totais',
      value: statistics.estatisticas_nivel_danos?.total || 0,
      icon: AlertTriangle,
      color: 'text-red-600'
    }
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, index) => {
        const Icon = card.icon
        return (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {card.title}
              </CardTitle>
              <Icon className={`h-4 w-4 ${card.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>

            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
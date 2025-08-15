'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  FileText, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Users,
  TrendingUp
} from 'lucide-react'
import { Assessment } from '@/types'

interface EstatisticasAvaliacoesProps {
  assessments: Assessment[]
  isLoading?: boolean
}

export function EstatisticasAvaliacoes({ assessments, isLoading }: EstatisticasAvaliacoesProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-full"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const stats = {
    total: assessments.length,
    urgent: assessments.filter(a => a.necessidade_urgente).length,
    completed: assessments.filter(a => (a as any).status === 'concluida').length,
    pending: assessments.filter(a => (a as any).status === 'pendente').length,
    totalPeople: assessments.reduce((sum, a) => sum + (a.affected_people || 0), 0),
    highSeverity: assessments.filter(a => a.severity === 'alto').length
  }

  const completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0

  const statisticsCards = [
    {
      title: 'Total de Avaliações',
      value: stats.total,
      icon: FileText,
      description: 'Avaliações registadas',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Necessidades Urgentes',
      value: stats.urgent,
      icon: AlertTriangle,
      description: 'Requerem atenção imediata',
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      badge: stats.urgent > 0 ? 'Atenção' : null
    },
    {
      title: 'Taxa de Conclusão',
      value: `${completionRate}%`,
      icon: CheckCircle,
      description: `${stats.completed} de ${stats.total} concluídas`,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Pessoas Afetadas',
      value: stats.totalPeople,
      icon: Users,
      description: 'Total de pessoas registadas',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    }
  ]

  return (
    <div className="space-y-4 mb-6">
      {/* Estatísticas principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statisticsCards.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index} className="transition-all duration-200 hover:shadow-md">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    {stat.title}
                  </CardTitle>
                  <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                    <Icon className={`h-4 w-4 ${stat.color}`} />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-gray-900">
                      {stat.value}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {stat.description}
                    </p>
                  </div>
                  {stat.badge && (
                    <Badge variant="destructive" className="text-xs">
                      {stat.badge}
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Alertas e resumos */}
      {(stats.urgent > 0 || stats.highSeverity > 0) && (
        <Card className="border-l-4 border-l-red-500 bg-red-50">
          <CardContent className="pt-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-red-900 mb-1">
                  Atenção Necessária
                </h4>
                <div className="text-sm text-red-800 space-y-1">
                  {stats.urgent > 0 && (
                    <p>• {stats.urgent} avaliação{stats.urgent !== 1 ? 'ões' : ''} com necessidades urgentes</p>
                  )}
                  {stats.highSeverity > 0 && (
                    <p>• {stats.highSeverity} avaliação{stats.highSeverity !== 1 ? 'ões' : ''} de alta severidade</p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Resumo de progresso */}
      {stats.total > 0 && (
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Progresso Geral</span>
              <span className="text-sm text-gray-500">{completionRate}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${completionRate}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>{stats.completed} concluídas</span>
              <span>{stats.pending} pendentes</span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
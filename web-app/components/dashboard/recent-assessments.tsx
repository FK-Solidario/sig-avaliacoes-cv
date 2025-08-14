'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useAssessmentStore } from '@/store/assessments'
import { formatDate, getSeverityColor, getStatusColor } from '@/lib/utils'
import { Eye, MapPin, Calendar } from 'lucide-react'

export function RecentAssessments() {
  const { assessments, loading, error, fetchAssessments } = useAssessmentStore()

  useEffect(() => {
    fetchAssessments()
  }, [])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Avaliações Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="flex items-center space-x-4">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Avaliações Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-500">Erro ao carregar avaliações: {error}</p>
        </CardContent>
      </Card>
    )
  }

  // Pegar as 5 avaliações mais recentes
  const recentAssessments = assessments
    .sort((a, b) => new Date(b.data_criacao).getTime() - new Date(a.data_criacao).getTime())
    .slice(0, 5)

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Avaliações Recentes</CardTitle>
        <Button variant="outline" size="sm" asChild>
          <Link href="/avaliacoes">
            Ver todas
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {recentAssessments.length === 0 ? (
          <div className="text-center py-8">
            <MapPin className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhuma avaliação</h3>
            <p className="mt-1 text-sm text-gray-500">
              Comece criando sua primeira avaliação de desastre.
            </p>
            <div className="mt-6">
              <Button asChild>
                <Link href="/avaliacoes/novo">
                  Nova Avaliação
                </Link>
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {recentAssessments.map((assessment) => (
              <div
                key={assessment.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm font-medium text-gray-900 truncate">
                      {assessment.title}
                    </h3>
                    <Badge 
                      variant={assessment.severity === 'critical' ? 'destructive' :
                                assessment.severity === 'high' ? 'outline' :
                                assessment.severity === 'medium' ? 'secondary' : 'default'}
                      className="text-xs"
                    >
                      {assessment.severity}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      <span>{assessment.location.address}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>{formatDate(assessment.data_criacao)}</span>
                    </div>
                  </div>
                  <div className="mt-1">
                    <Badge 
                      variant={assessment.status === 'completed' ? 'default' : 
                             assessment.status === 'pending' ? 'secondary' : 'outline'}
                      className="text-xs"
                    >
                      {assessment.status}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/avaliacoes/${assessment.id}`}>
                      <Eye className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
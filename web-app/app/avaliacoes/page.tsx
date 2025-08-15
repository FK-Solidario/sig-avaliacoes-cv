/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AlertTriangle } from 'lucide-react'
import { useAssessmentStore } from '@/store/assessments'
import { ListaAvaliacoes } from '@/components/avaliacoes/lista-avaliacoes'
import { Assessment } from '@/types'

export default function AvaliacoesPage() {
  const { assessments, loading, error, fetchAssessments } = useAssessmentStore()

  useEffect(() => {
    fetchAssessments()
  }, [])

  const handleRefresh = () => {
    fetchAssessments()
  }

  const handleBulkAction = (action: string, selectedIds: string[]) => {
    console.log(`Ação em lote: ${action}`, selectedIds)
    // Implementar ações em lote aqui
    switch (action) {
      case 'export':
        // Lógica de exportação
        console.log('Exportando avaliações:', selectedIds)
        break
      case 'delete':
        // Lógica de eliminação
        console.log('Eliminando avaliações:', selectedIds)
        break
      default:
        console.log('Ação não reconhecida:', action)
    }
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Avaliações de Desastres</h1>
            <p className="text-gray-600 mt-2">
              Gerir e acompanhar todas as avaliações de desastres
            </p>
          </div>
        </div>
        
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="text-center text-red-600">
              <AlertTriangle className="h-12 w-12 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Erro ao carregar avaliações</h3>
              <p className="mb-4">{error}</p>
              <Button onClick={fetchAssessments} variant="outline">
                Tentar Novamente
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Avaliações de Desastres</h1>
          <p className="text-gray-600 mt-2">
            Gerir e acompanhar todas as avaliações de desastres
          </p>
        </div>
      </div>

      <ListaAvaliacoes
        assessments={assessments}
        isLoading={loading}
        onRefresh={handleRefresh}
        onBulkAction={handleBulkAction}
      />
    </div>
  )
}
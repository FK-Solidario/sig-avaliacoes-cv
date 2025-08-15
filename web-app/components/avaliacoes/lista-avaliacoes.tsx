'use client'

import { useState, useEffect, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  LayoutGrid, 
  List, 
  Plus,
  RefreshCw,
  Download,
  Archive,
  Trash2,
  X,
  Settings,
  ChevronDown,
  AlertTriangle
} from 'lucide-react'
import Link from 'next/link'
import { Assessment } from '@/types'
import { AvaliacaoCard } from './avaliacao-card'
import { FiltrosAvaliacoes, FiltrosAvaliacoes as FiltrosType } from './filtros-avaliacoes'
import { EstatisticasAvaliacoes } from './estatisticas-avaliacoes'
import { DataTableAvaliacoes } from './data-table-avaliacoes'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface ListaAvaliacoesProps {
  assessments: Assessment[]
  isLoading?: boolean
  onRefresh?: () => void
  onBulkAction?: (action: string, selectedIds: string[]) => void
}

type ViewMode = 'grid' | 'table'

const initialFilters: FiltrosType = {
  search: '',
  severity: '',
  urgent_needs: '',
  structure_type: '',
  location: '',
  date_range: undefined,
  status: ''
}

export function ListaAvaliacoes({ 
  assessments, 
  isLoading = false, 
  onRefresh,
  onBulkAction 
}: ListaAvaliacoesProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [filters, setFilters] = useState<FiltrosType>(initialFilters)
  const [filtersExpanded, setFiltersExpanded] = useState(false)
  const [selectedIds, setSelectedIds] = useState<number[]>([])
  const [showBulkActions, setShowBulkActions] = useState(false)

  // Filtrar avaliações baseado nos filtros aplicados
  const filteredAssessments = useMemo(() => {
    return assessments.filter(assessment => {
      // Filtro de pesquisa
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase()
        const searchableText = [
          assessment.title,
          assessment.description,
          assessment.location,
          (assessment as any).responsavel_nome,
          (assessment as any).contacto_telefonico
        ].filter(Boolean).join(' ').toLowerCase()
        
        if (!searchableText.includes(searchTerm)) {
          return false
        }
      }

      // Filtro de severidade
      if (filters.severity && assessment.severity !== filters.severity) {
        return false
      }

      // Filtro de necessidades urgentes
      if (filters.urgent_needs) {
         const isUrgent = filters.urgent_needs === 'true'
         if ((assessment.necessidade_urgente ? true : false) !== isUrgent) {
           return false
         }
       }

      // Filtro de tipo de estrutura
      if (filters.structure_type && (assessment as any).tipo_estrutura !== filters.structure_type) {
        return false
      }

      // Filtro de localização
      if (filters.location) {
        const locationTerm = filters.location.toLowerCase()
        if (!assessment.endereco_completo?.toLowerCase().includes(locationTerm)) {
          return false
        }
      }

      // Filtro de status
      if (filters.status && (assessment as any).status !== filters.status) {
        return false
      }

      // Filtro de intervalo de datas
      if (filters.date_range?.from || filters.date_range?.to) {
        const assessmentDate = new Date(assessment.data_criacao)
        if (filters.date_range.from && assessmentDate < filters.date_range.from) {
          return false
        }
        if (filters.date_range.to && assessmentDate > filters.date_range.to) {
          return false
        }
      }

      return true
    })
  }, [assessments, filters])

  const handleClearFilters = () => {
    setFilters(initialFilters)
  }

  const handleSelectionChange = (ids: number[]) => {
    setSelectedIds(ids)
  }

  const handleSelectItem = (id: number) => {
    const newSelection = selectedIds.includes(id)
      ? selectedIds.filter(selectedId => selectedId !== id)
      : [...selectedIds, id]
    
    setSelectedIds(newSelection)
    setShowBulkActions(newSelection.length > 0)
  }

  const handleSelectAll = () => {
    if (selectedIds.length === filteredAssessments.length) {
      setSelectedIds([])
      setShowBulkActions(false)
    } else {
      setSelectedIds(filteredAssessments.map(a => a.id))
      setShowBulkActions(true)
    }
  }

  const clearSelection = () => {
    setSelectedIds([])
    setShowBulkActions(false)
  }

  const handleBulkAction = async (action: string, ids?: string[]) => {
    const targetIds = ids || selectedIds.map(id => id.toString())
    if (targetIds.length === 0) {
      return
    }

    try {
      switch (action) {
        case 'delete':
          const confirmDelete = window.confirm(
            `Tem a certeza que deseja eliminar ${targetIds.length} avaliação(ões)? Esta ação não pode ser desfeita.`
          )
          if (confirmDelete && onBulkAction) {
            onBulkAction(action, targetIds)
            setSelectedIds([])
            setShowBulkActions(false)
          }
          break
        
        case 'export':
          if (onBulkAction) {
            onBulkAction(action, targetIds)
          }
          break
        
        case 'archive':
          if (onBulkAction) {
            onBulkAction(action, targetIds)
            setSelectedIds([])
            setShowBulkActions(false)
          }
          break
        
        case 'priority':
          if (onBulkAction) {
            onBulkAction(action, targetIds)
          }
          break
        
        default:
          console.error('Ação não reconhecida')
      }
    } catch (error) {
      console.error('Erro na ação em lote:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Skeleton para estatísticas */}
        <EstatisticasAvaliacoes assessments={[]} isLoading={true} />
        
        {/* Skeleton para filtros */}
        <Card className="animate-pulse">
          <CardHeader>
            <div className="h-6 bg-gray-200 rounded w-1/4"></div>
          </CardHeader>
          <CardContent>
            <div className="h-10 bg-gray-200 rounded"></div>
          </CardContent>
        </Card>
        
        {/* Skeleton para lista */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Estatísticas */}
      <EstatisticasAvaliacoes assessments={filteredAssessments} />
      
      {/* Filtros */}
      <FiltrosAvaliacoes
        filters={filters}
        onFiltersChange={setFilters}
        onClearFilters={handleClearFilters}
        isExpanded={filtersExpanded}
        onToggleExpanded={() => setFiltersExpanded(!filtersExpanded)}
      />
      
      {/* Ações em Lote */}
      {showBulkActions && selectedIds.length > 0 && (
        <Card className="border-blue-200 bg-blue-50 animate-in slide-in-from-top-2">
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <Badge variant="secondary" className="font-medium">
                    {selectedIds.length} de {filteredAssessments.length} selecionada(s)
                  </Badge>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearSelection}
                  className="text-blue-600 hover:text-blue-700"
                >
                  <X className="h-4 w-4 mr-1" />
                  Limpar
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Settings className="h-4 w-4 mr-2" />
                      Prioridade
                      <ChevronDown className="h-4 w-4 ml-1" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleBulkAction('priority')}>
                      <AlertTriangle className="h-4 w-4 mr-2 text-red-500" />
                      Marcar como Crítico
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleBulkAction('priority')}>
                      <AlertTriangle className="h-4 w-4 mr-2 text-orange-500" />
                      Marcar como Alto
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleBulkAction('priority')}>
                      <AlertTriangle className="h-4 w-4 mr-2 text-yellow-500" />
                      Marcar como Médio
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleBulkAction('priority')}>
                      <AlertTriangle className="h-4 w-4 mr-2 text-green-500" />
                      Marcar como Baixo
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkAction('export')}
                  className="text-blue-600 border-blue-200 hover:bg-blue-50"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Exportar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkAction('archive')}
                  className="text-orange-600 border-orange-200 hover:bg-orange-50"
                >
                  <Archive className="h-4 w-4 mr-2" />
                  Arquivar
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleBulkAction('delete')}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Eliminar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Barra de ações */}
      <Card>
        <CardContent className="pt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">
                  {filteredAssessments.length} avaliação{filteredAssessments.length !== 1 ? 'ões' : ''}
                </span>
                {filters.search || filters.severity || filters.urgent_needs || 
                 filters.structure_type || filters.location || filters.status || 
                 filters.date_range?.from || filters.date_range?.to ? (
                  <Badge variant="secondary">
                    Filtrado de {assessments.length}
                  </Badge>
                ) : null}
              </div>
              
              {selectedIds.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-blue-600">
                    {selectedIds.length} selecionada{selectedIds.length !== 1 ? 's' : ''}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleBulkAction('export', selectedIds.map(String))}
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Exportar
                  </Button>
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              {onRefresh && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onRefresh}
                  disabled={isLoading}
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                  Atualizar
                </Button>
              )}
              
              <div className="flex items-center border rounded-lg p-1">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <LayoutGrid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'table' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('table')}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
              
              <Link href="/avaliacoes/novo">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Nova Avaliação
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Lista de avaliações */}
      {filteredAssessments.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <div className="text-gray-500">
              <LayoutGrid className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">
                Nenhuma avaliação encontrada
              </h3>
              <p className="text-sm mb-4">
                {filters.search || filters.severity || filters.urgent_needs || 
                 filters.structure_type || filters.location || filters.status ||
                 filters.date_range?.from || filters.date_range?.to
                  ? 'Tente ajustar os filtros para ver mais resultados.'
                  : 'Comece criando a sua primeira avaliação.'}
              </p>
              {filters.search || filters.severity || filters.urgent_needs || 
               filters.structure_type || filters.location || filters.status ||
               filters.date_range?.from || filters.date_range?.to ? (
                <Button variant="outline" onClick={handleClearFilters}>
                  Limpar Filtros
                </Button>
              ) : (
                <Link href="/avaliacoes/novo">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Criar Primeira Avaliação
                  </Button>
                </Link>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div>
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredAssessments.map((assessment) => (
                <AvaliacaoCard
                    key={assessment.id}
                    assessment={assessment}
                    onSelect={(id) => handleSelectItem(parseInt(id))}
                    isSelected={selectedIds.includes(assessment.id)}
                    showSelection={showBulkActions}
                  />
              ))}
            </div>
          ) : (
            <DataTableAvaliacoes
                assessments={filteredAssessments}
                selectedIds={selectedIds.map(id => id.toString())}
                onSelect={(id) => handleSelectItem(parseInt(id))}
                onSelectAll={handleSelectAll}
                showSelection={showBulkActions}
              />
          )}
        </div>
      )}
    </div>
  )
}
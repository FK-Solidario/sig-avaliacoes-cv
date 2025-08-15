'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { 
  Search, 
  Filter, 
  X, 
  Calendar,
  MapPin,
  AlertTriangle
} from 'lucide-react'
import { DatePickerWithRange } from '@/components/ui/date-range-picker'
import { DateRange } from 'react-day-picker'

export interface FiltrosAvaliacoes {
  search: string
  severity: string
  urgent_needs: string
  structure_type: string
  location: string
  date_range: DateRange | undefined
  status: string
}

interface FiltrosAvaliacoesProps {
  filters: FiltrosAvaliacoes
  onFiltersChange: (filters: FiltrosAvaliacoes) => void
  onClearFilters: () => void
  isExpanded: boolean
  onToggleExpanded: () => void
}

const SEVERITY_OPTIONS = [
  { value: '', label: 'Todos os níveis' },
  { value: 'baixo', label: 'Baixo' },
  { value: 'médio', label: 'Médio' },
  { value: 'alto', label: 'Alto' }
]

const STRUCTURE_OPTIONS = [
  { value: '', label: 'Todos os tipos' },
  { value: 'residencial', label: 'Residencial' },
  { value: 'comercial', label: 'Comercial' },
  { value: 'industrial', label: 'Industrial' },
  { value: 'publico', label: 'Público' },
  { value: 'infraestrutura', label: 'Infraestrutura' }
]

const STATUS_OPTIONS = [
  { value: '', label: 'Todos os status' },
  { value: 'pendente', label: 'Pendente' },
  { value: 'em_andamento', label: 'Em Andamento' },
  { value: 'concluida', label: 'Concluída' },
  { value: 'cancelada', label: 'Cancelada' }
]

export function FiltrosAvaliacoes({
  filters,
  onFiltersChange,
  onClearFilters,
  isExpanded,
  onToggleExpanded
}: FiltrosAvaliacoesProps) {
  const updateFilter = (key: keyof FiltrosAvaliacoes, value: any) => {
    onFiltersChange({ ...filters, [key]: value })
  }

  const getActiveFiltersCount = () => {
    let count = 0
    if (filters.search) count++
    if (filters.severity) count++
    if (filters.urgent_needs) count++
    if (filters.structure_type) count++
    if (filters.location) count++
    if (filters.date_range?.from || filters.date_range?.to) count++
    if (filters.status) count++
    return count
  }

  const activeFiltersCount = getActiveFiltersCount()

  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filtros
            </CardTitle>
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {activeFiltersCount} ativo{activeFiltersCount !== 1 ? 's' : ''}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            {activeFiltersCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearFilters}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-4 w-4 mr-1" />
                Limpar
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleExpanded}
            >
              {isExpanded ? 'Recolher' : 'Expandir'}
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Pesquisa sempre visível */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Pesquisar avaliações..."
            value={filters.search}
            onChange={(e) => updateFilter('search', e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Filtros expandidos */}
        {isExpanded && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 border-t">
            {/* Nível de Severidade */}
            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Nível de Severidade
              </Label>
              <Select
                value={filters.severity}
                onValueChange={(value) => updateFilter('severity', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar nível" />
                </SelectTrigger>
                <SelectContent>
                  {SEVERITY_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Necessidades Urgentes */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Necessidades Urgentes
              </Label>
              <Select
                value={filters.urgent_needs}
                onValueChange={(value) => updateFilter('urgent_needs', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar urgência" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todas</SelectItem>
                  <SelectItem value="true">Sim</SelectItem>
                  <SelectItem value="false">Não</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Tipo de Estrutura */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Tipo de Estrutura
              </Label>
              <Select
                value={filters.structure_type}
                onValueChange={(value) => updateFilter('structure_type', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar tipo" />
                </SelectTrigger>
                <SelectContent>
                  {STRUCTURE_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Localização */}
            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Localização
              </Label>
              <Input
                placeholder="Filtrar por localização..."
                value={filters.location}
                onChange={(e) => updateFilter('location', e.target.value)}
              />
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Status
              </Label>
              <Select
                value={filters.status}
                onValueChange={(value) => updateFilter('status', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar status" />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Intervalo de Datas */}
            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Período
              </Label>
              <DatePickerWithRange
                date={filters.date_range}
                onDateChange={(date) => updateFilter('date_range', date)}
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
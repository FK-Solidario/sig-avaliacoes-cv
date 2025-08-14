'use client'

import { useEffect, useState } from 'react'
import { useAssessmentStore } from '@/store/assessments'
import { useStatisticsStore } from '@/store/statistics'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Plus, Search, Filter, MapPin, Calendar, Users } from 'lucide-react'
import Link from 'next/link'
import { AvaliacaoFilters } from '@/types'

export default function AvaliacoesPage() {
  const { 
    assessments, 
    loading, 
    error, 
    filters,
    setFilters,
    fetchAvaliacoes 
  } = useAssessmentStore()
  
  const { options, fetchOptions } = useStatisticsStore()
  
  const [searchTerm, setSearchTerm] = useState('')
  const [localFilters, setLocalFilters] = useState<AvaliacaoFilters>({})

  useEffect(() => {
    fetchAvaliacoes()
    fetchOptions()
  }, [])

  const handleSearch = () => {
    const newFilters: AvaliacaoFilters = {
      ...localFilters,
      ...(searchTerm && { search: searchTerm })
    }
    setFilters(newFilters)
    fetchAvaliacoes(newFilters)
  }

  const handleFilterChange = (key: keyof AvaliacaoFilters, value: string) => {
    const newFilters = { ...localFilters, [key]: value }
    setLocalFilters(newFilters)
  }

  const clearFilters = () => {
    setLocalFilters({})
    setSearchTerm('')
    setFilters({})
    fetchAvaliacoes({})
  }

  const getSeverityColor = (severity: string) => {
    switch (severity?.toLowerCase()) {
      case 'baixo':
        return 'bg-green-100 text-green-800'
      case 'médio':
      case 'medio':
        return 'bg-yellow-100 text-yellow-800'
      case 'alto':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getUrgentNeedColor = (urgent: boolean) => {
    return urgent 
      ? 'bg-red-100 text-red-800' 
      : 'bg-green-100 text-green-800'
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Erro ao carregar avaliações</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => fetchAvaliacoes()}>Tentar novamente</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Avaliações de Desastres</h1>
          <p className="text-gray-600 mt-2">Gerencie e visualize todas as avaliações registradas</p>
        </div>
        <Link href="/avaliacoes/novo">
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Nova Avaliação
          </Button>
        </Link>
      </div>

      {/* Filtros */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div className="flex gap-2">
              <Input
                placeholder="Buscar por nome ou endereço..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1"
              />
              <Button onClick={handleSearch} size="icon">
                <Search className="h-4 w-4" />
              </Button>
            </div>
            
            <Select 
              value={localFilters.necessidade_urgente?.toString() || ''} 
              onValueChange={(value) => handleFilterChange('necessidade_urgente', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Necessidade Urgente" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Sim</SelectItem>
                <SelectItem value="false">Não</SelectItem>
              </SelectContent>
            </Select>

            <Select 
              value={localFilters.tipo_estrutura || ''} 
              onValueChange={(value) => handleFilterChange('tipo_estrutura', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Tipo de Estrutura" />
              </SelectTrigger>
              <SelectContent>
                {options?.tipos_estrutura?.map((tipo) => (
                  <SelectItem key={tipo} value={tipo}>{tipo}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select 
              value={localFilters.nivel_danos || ''} 
              onValueChange={(value) => handleFilterChange('nivel_danos', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Nível de Danos" />
              </SelectTrigger>
              <SelectContent>
                {options?.niveis_danos?.map((nivel) => (
                  <SelectItem key={nivel} value={nivel}>{nivel}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex gap-2">
            <Button onClick={handleSearch}>Aplicar Filtros</Button>
            <Button variant="outline" onClick={clearFilters}>Limpar Filtros</Button>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Avaliações */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3 mb-4" />
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-6 w-20" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : assessments.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhuma avaliação encontrada</h3>
            <p className="text-gray-600 mb-4">Não há avaliações que correspondam aos filtros aplicados.</p>
            <Link href="/avaliacoes/novo">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Criar primeira avaliação
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {assessments.map((assessment) => (
            <Link key={assessment.id} href={`/avaliacoes/${assessment.id}`}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle className="text-lg">{assessment.title}</CardTitle>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span className="truncate">{assessment.description}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span>{new Date(assessment.data_criacao).toLocaleDateString('pt-BR')}</span>
                    </div>
                    
                    {assessment.affected_people && (
                      <div className="flex items-center gap-2 text-sm">
                        <Users className="h-4 w-4 text-gray-500" />
                        <span>{assessment.affected_people} pessoas afetadas</span>
                      </div>
                    )}
                    
                    <div className="flex gap-2 flex-wrap">
                      <Badge className={getSeverityColor(assessment.severity)}>
                        {assessment.severity}
                      </Badge>
                      
                      {assessment.disaster_type && (
                        <Badge variant="outline">
                          {assessment.disaster_type}
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
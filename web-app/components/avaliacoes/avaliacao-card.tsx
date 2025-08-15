'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  MapPin, 
  Calendar, 
  Users, 
  AlertTriangle, 
  Eye, 
  Edit,
  Phone,
  CheckSquare,
  Square,
  Trash2
} from 'lucide-react'
import Link from 'next/link'
import { Assessment } from '@/types'

interface AvaliacaoCardProps {
  assessment: Assessment
  onSelect?: (id: string) => void
  isSelected?: boolean
  showSelection?: boolean
  showActions?: boolean
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
}

export function AvaliacaoCard({ 
  assessment, 
  onSelect, 
  isSelected = false, 
  showActions = true,
  onEdit,
  onDelete,
  showSelection = false
}: AvaliacaoCardProps) {
  const getSeverityColor = (severity: string) => {
    switch (severity?.toLowerCase()) {
      case 'baixo':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'médio':
      case 'medio':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'alto':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getUrgentNeedColor = (urgent: boolean) => {
    return urgent 
      ? 'bg-red-100 text-red-800 border-red-200' 
      : 'bg-green-100 text-green-800 border-green-200'
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-PT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleCardClick = (e: React.MouseEvent) => {
    // Prevenir seleção quando clicar em botões ou links
    if ((e.target as HTMLElement).closest('button, a')) {
      return
    }
    
    if (showSelection && onSelect) {
      onSelect(assessment.id.toString())
    }
  }

  const handleCheckboxChange = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (onSelect) {
      onSelect(assessment.id.toString())
    }
  }

  return (
    <Card 
      className={`transition-all duration-200 hover:shadow-md cursor-pointer ${
        isSelected ? 'ring-2 ring-blue-500 bg-blue-50' : ''
      } ${showSelection ? 'hover:bg-gray-50' : ''}`}
      onClick={handleCardClick}
    >
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex items-start gap-3 flex-1">
            {showSelection && (
              <div className="mt-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 hover:bg-transparent"
                  onClick={handleCheckboxChange}
                >
                  {isSelected ? (
                    <CheckSquare className="h-4 w-4 text-blue-600" />
                  ) : (
                    <Square className="h-4 w-4 text-gray-400" />
                  )}
                </Button>
              </div>
            )}
            <div className="flex-1">
            <CardTitle className="text-lg font-semibold text-gray-900 mb-1">
              {assessment.title || `Avaliação ${assessment.id}`}
            </CardTitle>
            <p className="text-sm text-gray-600 line-clamp-2">
              {assessment.description || 'Sem descrição disponível'}
            </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {onEdit && (
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  onEdit(assessment.id.toString())
                }}
              >
                <Edit className="h-4 w-4" />
              </Button>
            )}
            {onDelete && (
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  onDelete(assessment.id.toString())
                }}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Informações principais */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2 text-gray-600">
            <Users className="h-4 w-4" />
            <span>{assessment.affected_people || 'N/A'} pessoas</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Calendar className="h-4 w-4" />
            <span>{formatDate(assessment.data_criacao)}</span>
          </div>
        </div>

        {/* Localização */}
        {assessment.location && (
          <div className="flex items-start gap-2 text-sm text-gray-600">
            <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <span className="line-clamp-1">{typeof assessment.location === 'string' ? assessment.location : assessment.location?.address || 'Localização não especificada'}</span>
          </div>
        )}

        {/* Contacto */}
        {(assessment as any).contacto_telefonico && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Phone className="h-4 w-4" />
            <span>{(assessment as any).contacto_telefonico}</span>
          </div>
        )}

        {/* Badges de status */}
        <div className="flex flex-wrap gap-2">
          {assessment.nivel_danos && (
            <Badge 
              variant="outline" 
              className={getSeverityColor(assessment.nivel_danos)}
            >
              {assessment.nivel_danos}
            </Badge>
          )}
          
          {assessment.necessidade_urgente && (
            <Badge 
              variant="outline" 
              className="bg-red-100 text-red-800 border-red-200"
            >
              <AlertTriangle className="h-3 w-3 mr-1" />
              {assessment.necessidade_urgente}
            </Badge>
          )}

          {(assessment as any).tipo_estrutura && (
            <Badge variant="secondary">
              {(assessment as any).tipo_estrutura}
            </Badge>
          )}
        </div>

        {/* Ações */}
        {showActions && (
          <div className="flex gap-2 pt-2 border-t">
            <Link href={`/avaliacoes/${assessment.id}`} className="flex-1">
              <Button variant="outline" size="sm" className="w-full">
                <Eye className="h-4 w-4 mr-2" />
                Ver Detalhes
              </Button>
            </Link>
            <Link href={`/avaliacoes/${assessment.id}/editar`}>
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
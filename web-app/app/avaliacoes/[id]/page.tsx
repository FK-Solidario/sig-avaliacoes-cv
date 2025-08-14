'use client'

import { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAssessmentStore } from '@/store/assessments'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  MapPin, 
  Calendar, 
  Users, 
  Phone, 
  FileText,
  AlertTriangle,
  Home,
  User
} from 'lucide-react'
import Link from 'next/link'


export default function AvaliacaoDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  
  const { 
    currentAssessment, 
    loading, 
    error, 
    fetchAssessment,
    deleteAssessment 
  } = useAssessmentStore()

  useEffect(() => {
    if (id) {
      fetchAssessment(id)
    }
  }, [id, fetchAssessment])

  const handleDelete = async () => {
    if (confirm('Tem certeza que deseja excluir esta avaliação?')) {
      try {
        await deleteAssessment(id)
        router.push('/avaliacoes')
      } catch (error) {
        console.error('Erro ao excluir avaliação:', error)
      }
    }
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

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-48" />
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-32 w-full" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  if (error || !currentAssessment) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            {error || 'Avaliação não encontrada'}
          </h2>
          <p className="text-gray-600 mb-4">
            Não foi possível carregar os detalhes da avaliação.
          </p>
          <Link href="/avaliacoes">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar para lista
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Link href="/avaliacoes">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">{currentAssessment.title}</h1>
          <p className="text-gray-600 mt-2">{currentAssessment.description}</p>
        </div>
        
        <div className="flex gap-2">
          <Link href={`/avaliacoes/${id}/editar`}>
            <Button variant="outline">
              <Edit className="h-4 w-4 mr-2" />
              Editar
            </Button>
          </Link>
          <Button variant="destructive" onClick={handleDelete}>
            <Trash2 className="h-4 w-4 mr-2" />
            Excluir
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Conteúdo Principal */}
        <div className="lg:col-span-2 space-y-6">
          {/* Informações Básicas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Informações do Responsável
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Nome</label>
                  <p className="text-gray-900">{(currentAssessment as any).nome_responsavel || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Documento</label>
                  <p className="text-gray-900">{(currentAssessment as any).numero_documento || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Telefone</label>
                  <p className="text-gray-900 flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    {(currentAssessment as any).contacto_telefonico || 'N/A'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Membros do Agregado</label>
                  <p className="text-gray-900 flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    {currentAssessment.affected_people || 'N/A'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Localização */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Localização
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Endereço Completo</label>
                  <p className="text-gray-900">{currentAssessment.location.address}</p>
                </div>
                
                {(currentAssessment as any).ponto_referencia && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Ponto de Referência</label>
                    <p className="text-gray-900">{(currentAssessment as any).ponto_referencia}</p>
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Latitude</label>
                    <p className="text-gray-900">{currentAssessment.location.latitude}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Longitude</label>
                    <p className="text-gray-900">{currentAssessment.location.longitude}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Avaliação de Danos */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Home className="h-5 w-5" />
                Avaliação de Danos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Tipo de Estrutura</label>
                  <Badge variant="outline" className="mt-1">
                    {currentAssessment.disaster_type}
                  </Badge>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Nível de Danos</label>
                  <Badge className={getSeverityColor(currentAssessment.severity)}>
                    {currentAssessment.severity}
                  </Badge>
                </div>
              </div>
              
              {(currentAssessment as any).necessidade_urgente !== undefined && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Necessidade Urgente</label>
                  <div className="mt-1">
                    <Badge className={getUrgentNeedColor((currentAssessment as any).necessidade_urgente)}>
                      {(currentAssessment as any).necessidade_urgente ? 'Sim' : 'Não'}
                    </Badge>
                  </div>
                </div>
              )}
              
              {currentAssessment.notes && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Outras Perdas/Observações</label>
                  <p className="text-gray-900 mt-1">{currentAssessment.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Mapa */}
          <Card>
            <CardHeader>
              <CardTitle>Localização no Mapa</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 rounded-lg overflow-hidden">
                <div className="h-[300px] bg-gray-100 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500">Mapa não disponível</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Informações Adicionais */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Informações Adicionais
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Data de Criação</label>
                <p className="text-gray-900">
                  {new Date(currentAssessment.data_criacao).toLocaleDateString('pt-BR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500">Última Atualização</label>
                <p className="text-gray-900">
                  {new Date(currentAssessment.data_criacao).toLocaleDateString('pt-BR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500">Status</label>
                <Badge className="mt-1">
                  {currentAssessment.status === 'completed' ? 'Concluída' : currentAssessment.status}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
'use client'

import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  ArrowLeft, 
  Save, 
  X, 
  AlertTriangle, 
  Clock, 
  User, 
  MapPin,
  FileText,
  History
} from 'lucide-react'
import { toast } from 'sonner'
import { useAssessmentStore } from '@/store/assessments'
import { FormularioAvaliacao } from '@/components/avaliacoes/formulario-avaliacao'
import { Assessment } from '@/types'

const getSeverityColor = (nivel: 'parcial' | 'grave' | 'total') => {
  switch (nivel) {
    case 'total': return 'bg-red-500'
    case 'grave': return 'bg-orange-500'
    case 'parcial': return 'bg-green-500'
    default: return 'bg-gray-500'
  }
}

const getSeverityLabel = (nivel: 'parcial' | 'grave' | 'total') => {
  switch (nivel) {
    case 'total': return 'Total'
    case 'grave': return 'Grave'
    case 'parcial': return 'Parcial'
    default: return 'Não definido'
  }
}

export default function EditarAvaliacaoPage() {
  const params = useParams()
  const router = useRouter()
  const { assessments, loading, updateAssessment } = useAssessmentStore()
  const [avaliacao, setAvaliacao] = useState<Assessment | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)

  const avaliacaoId = params.id as string

  useEffect(() => {
    const avaliacaoEncontrada = assessments.find((a: any) => a.id === avaliacaoId)
    if (avaliacaoEncontrada) {
      setAvaliacao(avaliacaoEncontrada)
    } else if (!loading) {
      toast.error('Avaliação não encontrada')
      router.push('/avaliacoes')
    }
  }, [avaliacaoId, assessments, loading, router])

  const handleSubmit = async (data: Partial<Assessment>) => {
    if (!avaliacao) return

    setIsSubmitting(true)
    try {
      const avaliacaoAtualizada: Assessment = {
        ...avaliacao,
        ...data,
        data_atualizacao: new Date().toISOString()
      }

      await updateAssessment(avaliacaoId, avaliacaoAtualizada)
      toast.success('Avaliação atualizada com sucesso!')
      setHasChanges(false)
      router.push(`/avaliacoes/${avaliacaoId}`)
    } catch (error) {
      console.error('Erro ao atualizar avaliação:', error)
      toast.error('Erro ao atualizar avaliação')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    if (hasChanges) {
      const confirmLeave = window.confirm(
        'Tem alterações não guardadas. Tem a certeza que deseja sair?'
      )
      if (!confirmLeave) return
    }
    router.back()
  }

  const handleFormChange = () => {
    setHasChanges(true)
  }

  // Prevenir saída acidental com alterações não guardadas
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasChanges) {
        e.preventDefault()
        e.returnValue = ''
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [hasChanges])

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (!avaliacao) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="py-12 text-center">
            <AlertTriangle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h2 className="text-xl font-semibold mb-2">Avaliação não encontrada</h2>
            <p className="text-gray-500 mb-4">
              A avaliação que procura não existe ou foi removida.
            </p>
            <Button 
              onClick={() => router.push('/avaliacoes')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar às Avaliações
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      {/* Cabeçalho */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold">Editar Avaliação</h1>
              {hasChanges && (
                <Badge variant="outline" className="text-orange-600 border-orange-600">
                  <Clock className="h-3 w-3 mr-1" />
                  Alterações não guardadas
                </Badge>
              )}
            </div>
            <p className="text-gray-600 mb-3">
              Atualize as informações da avaliação #{avaliacao.id}
            </p>
            
            {/* Informações Resumidas */}
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-gray-400" />
                <span>{avaliacao.nome_responsavel}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-400" />
                <span>{typeof avaliacao.location === 'string' ? avaliacao.location : avaliacao.location?.address || 'Localização não disponível'}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${getSeverityColor(avaliacao.nivel_danos)}`}></div>
                <span>Nível {getSeverityLabel(avaliacao.nivel_danos)}</span>
              </div>
              {avaliacao.necessidade_urgente && (
                <Badge variant="destructive" className="text-xs">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  Necessidade urgente
                </Badge>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            <X className="h-4 w-4 mr-2" />
            Cancelar
          </Button>
          <Button
            onClick={() => router.push(`/avaliacoes/${avaliacaoId}`)}
            variant="outline"
            disabled={isSubmitting}
          >
            <FileText className="h-4 w-4 mr-2" />
            Ver Detalhes
          </Button>
        </div>
      </div>

      {/* Aviso de Alterações */}
      {hasChanges && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="py-3">
            <div className="flex items-center gap-2 text-orange-800">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-sm font-medium">
                Tem alterações não guardadas. Não se esqueça de guardar antes de sair.
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Informações de Auditoria */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm">
            <History className="h-4 w-4" />
            Histórico da Avaliação
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Criada em</p>
              <p className="font-medium">
                {new Date(avaliacao.data_criacao).toLocaleDateString('pt-PT', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
            {avaliacao.data_atualizacao && (
              <div>
                <p className="text-gray-500">Última atualização</p>
                <p className="font-medium">
                  {new Date(avaliacao.data_atualizacao).toLocaleDateString('pt-PT', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            )}
            <div>
              <p className="text-gray-500">Status</p>
              <Badge variant={avaliacao.status === 'concluida' ? 'default' : 'secondary'}>
                {avaliacao.status === 'concluida' ? 'Concluída' : 
                 avaliacao.status === 'em_andamento' ? 'Em Andamento' : 'Pendente'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* Formulário */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Informações da Avaliação
          </CardTitle>
        </CardHeader>
        <CardContent>
          <FormularioAvaliacao
            avaliacao={avaliacao}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            loading={isSubmitting}
            modo="editar"
          />
        </CardContent>
      </Card>
    </div>
  )
}
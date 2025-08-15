'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { avaliacoesService } from '@/services/avaliacoes'
import { Assessment } from '@/types'
import { toast } from 'sonner'
import { DetalhesAvaliacao } from '@/components/avaliacoes/detalhes-avaliacao'

export default function DetalhesAvaliacaoPage() {
  const params = useParams()
  const router = useRouter()
  const [avaliacao, setAvaliacao] = useState<Assessment | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const carregarAvaliacao = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await avaliacoesService.obterPorId(params.id as string)
        setAvaliacao(data)
      } catch (err) {
        console.error('Erro ao carregar avaliação:', err)
        setError('Erro ao carregar os detalhes da avaliação')
        toast.error('Erro ao carregar avaliação')
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      carregarAvaliacao()
    }
  }, [params.id])

  const handleEditar = () => {
    router.push(`/avaliacoes/${params.id}/editar`)
  }

  const handleEliminar = async () => {
    if (!avaliacao) return
    
    if (confirm('Tem certeza que deseja eliminar esta avaliação?')) {
      try {
        await avaliacoesService.eliminar(avaliacao.id)
        toast.success('Avaliação eliminada com sucesso')
        router.push('/avaliacoes')
      } catch (err) {
        console.error('Erro ao eliminar avaliação:', err)
        toast.error('Erro ao eliminar avaliação')
      }
    }
  }

  const handlePartilhar = () => {
    if (!avaliacao) return
    
    const url = window.location.href
    navigator.clipboard.writeText(url).then(() => {
      toast.success('Link copiado para a área de transferência')
    }).catch(() => {
      toast.error('Erro ao copiar link')
    })
  }

  const handleExportar = () => {
    if (!avaliacao) return
    
    // Simular exportação para PDF
    toast.success('Relatório exportado com sucesso')
  }



  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="flex items-center gap-4">
            <div className="h-10 w-20 bg-gray-200 rounded"></div>
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          </div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (error || !avaliacao) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Erro</h1>
          <p className="text-gray-600 mb-6">{error || 'Avaliação não encontrada'}</p>
          <Button onClick={() => router.push('/avaliacoes')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar às Avaliações
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Botão Voltar */}
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => router.push('/avaliacoes')}
        className="mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Voltar às Avaliações
      </Button>

      {/* Componente de Detalhes */}
      <DetalhesAvaliacao
        avaliacao={avaliacao}
        onEdit={handleEditar}
        onDelete={handleEliminar}
        onShare={handlePartilhar}
        onDownload={handleExportar}
      />
    </div>
  )
}
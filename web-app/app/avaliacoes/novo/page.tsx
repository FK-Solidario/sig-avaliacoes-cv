'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'
import { avaliacoesService } from '@/services/avaliacoes'
import { FormularioAvaliacao } from '@/components/avaliacoes/formulario-avaliacao'
import type { EntradaAvaliacao } from '@/types'

export default function NovaAvaliacaoPage() {
  const router = useRouter()

  const handleSubmit = async (data: EntradaAvaliacao) => {
    try {
      await avaliacoesService.criar(data)
      router.push('/avaliacoes')
    } catch (error) {
      console.error('Erro ao criar avaliação:', error)
      throw error
    }
  }

  const handleCancel = () => {
    router.push('/avaliacoes')
  }

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/avaliacoes">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Nova Avaliação de Desastre</h1>
          <p className="text-gray-600 mt-2">Preencha os dados para registrar uma nova avaliação</p>
        </div>
      </div>

      <FormularioAvaliacao
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </div>
  )
}
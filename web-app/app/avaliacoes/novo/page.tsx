'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAssessmentStore } from '@/store/assessments'
import { useStatisticsStore } from '@/store/statistics'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'
import { ArrowLeft, Save, MapPin, User, Home, AlertTriangle } from 'lucide-react'
import Link from 'next/link'
import { EntradaAvaliacao } from '@/types'

const avaliacaoSchema = z.object({
  nome_responsavel: z.string().min(1, 'Nome é obrigatório'),
  numero_documento: z.string().min(1, 'Número do documento é obrigatório'),
  contacto_telefonico: z.string().min(1, 'Contacto telefónico é obrigatório'),
  membros_agregado: z.number().min(1, 'Número de membros deve ser maior que 0'),
  endereco_completo: z.string().min(1, 'Endereço é obrigatório'),
  tipo_estrutura: z.enum(['habitacao', 'comercio', 'agricultura', 'outro']),
  nivel_danos: z.enum(['parcial', 'grave', 'total']),
  necessidade_urgente: z.enum(['agua_potavel', 'alimentacao', 'abrigo_temporario', 'roupas_cobertores', 'medicamentos', 'outros']),
  grupos_vulneraveis: z.array(z.string()).optional(),
  ponto_referencia: z.string().optional(),
  latitude_gps: z.number().optional(),
  longitude_gps: z.number().optional(),
  perdas: z.array(z.string()).optional(),
  outras_perdas: z.string().optional(),
})

type AvaliacaoFormData = z.infer<typeof avaliacaoSchema>

export default function NovaAvaliacaoPage() {
  const router = useRouter()
  const { createAssessment, loading } = useAssessmentStore()
  const { options, fetchOptions } = useStatisticsStore()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<AvaliacaoFormData>({
    resolver: zodResolver(avaliacaoSchema),
    defaultValues: {
      necessidade_urgente: 'agua_potavel',
      grupos_vulneraveis: [],
      perdas: [],
      membros_agregado: 1
    }
  })

  useEffect(() => {
    fetchOptions()
  }, [])

  const onSubmit = async (data: AvaliacaoFormData) => {
    setIsSubmitting(true)
    try {
      const avaliacaoData: EntradaAvaliacao = {
        nome_responsavel: data.nome_responsavel,
        numero_documento: data.numero_documento,
        contacto_telefonico: data.contacto_telefonico,
        membros_agregado: data.membros_agregado,
        endereco_completo: data.endereco_completo,
        tipo_estrutura: data.tipo_estrutura,
        nivel_danos: data.nivel_danos,
        necessidade_urgente: data.necessidade_urgente,
        ...(data.grupos_vulneraveis && { grupos_vulneraveis: data.grupos_vulneraveis }),
        ...(data.ponto_referencia && { ponto_referencia: data.ponto_referencia }),
        ...(data.latitude_gps && { latitude_gps: data.latitude_gps }),
        ...(data.longitude_gps && { longitude_gps: data.longitude_gps }),
        ...(data.perdas && { perdas: data.perdas }),
        ...(data.outras_perdas && { outras_perdas: data.outras_perdas }),
      }

      await createAssessment(avaliacaoData)
      router.push('/avaliacoes')
    } catch (error) {
      console.error('Erro ao criar avaliação:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleGruposVulneraveisChange = (grupo: string, checked: boolean) => {
    const currentGrupos = watch('grupos_vulneraveis') || []
    if (checked) {
      setValue('grupos_vulneraveis', [...currentGrupos, grupo])
    } else {
      setValue('grupos_vulneraveis', currentGrupos.filter(g => g !== grupo))
    }
  }

  const handlePerdasChange = (perda: string, checked: boolean) => {
    const currentPerdas = watch('perdas') || []
    if (checked) {
      setValue('perdas', [...currentPerdas, perda])
    } else {
      setValue('perdas', currentPerdas.filter(p => p !== perda))
    }
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

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Formulário Principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Informações do Responsável */}
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
                    <Label htmlFor="nome_responsavel">Nome Completo *</Label>
                    <Input
                      id="nome_responsavel"
                      {...register('nome_responsavel')}
                      placeholder="Digite o nome completo"
                    />
                    {errors.nome_responsavel && (
                      <p className="text-sm text-red-600 mt-1">{errors.nome_responsavel.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="numero_documento">Número do Documento *</Label>
                    <Input
                      id="numero_documento"
                      {...register('numero_documento')}
                      placeholder="BI, Passaporte, etc."
                    />
                    {errors.numero_documento && (
                      <p className="text-sm text-red-600 mt-1">{errors.numero_documento.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="contacto_telefonico">Contacto Telefónico *</Label>
                    <Input
                      id="contacto_telefonico"
                      {...register('contacto_telefonico')}
                      placeholder="+238 xxx xxx xxx"
                    />
                    {errors.contacto_telefonico && (
                      <p className="text-sm text-red-600 mt-1">{errors.contacto_telefonico.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="membros_agregado">Membros do Agregado *</Label>
                    <Input
                      id="membros_agregado"
                      type="number"
                      min="1"
                      {...register('membros_agregado', { valueAsNumber: true })}
                      placeholder="Número de pessoas"
                    />
                    {errors.membros_agregado && (
                      <p className="text-sm text-red-600 mt-1">{errors.membros_agregado.message}</p>
                    )}
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
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="endereco_completo">Endereço Completo *</Label>
                  <Textarea
                    id="endereco_completo"
                    {...register('endereco_completo')}
                    placeholder="Digite o endereço completo"
                    rows={3}
                  />
                  {errors.endereco_completo && (
                    <p className="text-sm text-red-600 mt-1">{errors.endereco_completo.message}</p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="ponto_referencia">Ponto de Referência</Label>
                  <Input
                    id="ponto_referencia"
                    {...register('ponto_referencia')}
                    placeholder="Ex: Próximo à escola, igreja, etc."
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="latitude_gps">Latitude GPS</Label>
                    <Input
                      id="latitude_gps"
                      type="number"
                      step="any"
                      {...register('latitude_gps', { valueAsNumber: true })}
                      placeholder="Ex: 14.9177"
                    />
                  </div>
                  <div>
                    <Label htmlFor="longitude_gps">Longitude GPS</Label>
                    <Input
                      id="longitude_gps"
                      type="number"
                      step="any"
                      {...register('longitude_gps', { valueAsNumber: true })}
                      placeholder="Ex: -23.5092"
                    />
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
                    <Label htmlFor="tipo_estrutura">Tipo de Estrutura *</Label>
                    <Select onValueChange={(value) => setValue('tipo_estrutura', value as 'habitacao' | 'comercio' | 'agricultura' | 'outro')}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        {options?.tipos_estrutura?.map((tipo) => (
                          <SelectItem key={tipo} value={tipo}>{tipo}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.tipo_estrutura && (
                      <p className="text-sm text-red-600 mt-1">{errors.tipo_estrutura.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="nivel_danos">Nível de Danos *</Label>
                    <Select onValueChange={(value) => setValue('nivel_danos', value as 'parcial' | 'grave' | 'total')}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o nível" />
                      </SelectTrigger>
                      <SelectContent>
                        {options?.niveis_danos?.map((nivel) => (
                          <SelectItem key={nivel} value={nivel}>{nivel}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.nivel_danos && (
                      <p className="text-sm text-red-600 mt-1">{errors.nivel_danos.message}</p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="necessidade_urgente"
                    onCheckedChange={(checked) => setValue('necessidade_urgente', checked ? 'agua_potavel' : 'outros')}
                  />
                  <Label htmlFor="necessidade_urgente" className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                    Necessidade Urgente
                  </Label>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Grupos Vulneráveis */}
            <Card>
              <CardHeader>
                <CardTitle>Grupos Vulneráveis</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {options?.grupos_vulneraveis?.map((grupo) => (
                  <div key={grupo} className="flex items-center space-x-2">
                    <Checkbox
                      id={`grupo_${grupo}`}
                      onCheckedChange={(checked) => handleGruposVulneraveisChange(grupo, !!checked)}
                    />
                    <Label htmlFor={`grupo_${grupo}`} className="text-sm">{grupo}</Label>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Tipos de Perdas */}
            <Card>
              <CardHeader>
                <CardTitle>Tipos de Perdas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {options?.tipos_perdas?.map((perda) => (
                  <div key={perda} className="flex items-center space-x-2">
                    <Checkbox
                      id={`perda_${perda}`}
                      onCheckedChange={(checked) => handlePerdasChange(perda, !!checked)}
                    />
                    <Label htmlFor={`perda_${perda}`} className="text-sm">{perda}</Label>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Outras Perdas */}
            <Card>
              <CardHeader>
                <CardTitle>Outras Perdas/Observações</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  {...register('outras_perdas')}
                  placeholder="Descreva outras perdas ou observações relevantes..."
                  rows={4}
                />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="flex justify-end gap-4 pt-6 border-t">
          <Link href="/avaliacoes">
            <Button type="button" variant="outline">
              Cancelar
            </Button>
          </Link>
          <Button type="submit" disabled={isSubmitting || loading}>
            <Save className="h-4 w-4 mr-2" />
            {isSubmitting ? 'Salvando...' : 'Salvar Avaliação'}
          </Button>
        </div>
      </form>
    </div>
  )
}
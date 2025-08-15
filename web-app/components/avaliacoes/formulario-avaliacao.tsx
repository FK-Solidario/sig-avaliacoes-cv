'use client'

import { useState, useEffect } from 'react'
import { useForm, Controller, FieldValues } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Save, 
  MapPin, 
  User, 
  Phone, 
  Mail, 
  Home, 
  AlertTriangle, 
  Users, 
  FileText,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react'
import { Assessment } from '@/types'
import { toast } from 'sonner'

// Schema de validação
const avaliacaoSchema = z.object({
  titulo: z.string().min(3, 'Título deve ter pelo menos 3 caracteres'),
  descricao: z.string().min(10, 'Descrição deve ter pelo menos 10 caracteres'),
  responsavel_nome: z.string().min(2, 'Nome é obrigatório'),
  responsavel_telefone: z.string().min(9, 'Telefone deve ter pelo menos 9 dígitos'),
  responsavel_email: z.string().email('Email inválido').optional().or(z.literal('')),
  numero_documento: z.string().min(5, 'Número do documento é obrigatório'),
  membros_agregado: z.number().min(1, 'Deve ter pelo menos 1 membro').max(50, 'Máximo 50 membros'),
  morada: z.string().min(5, 'Morada é obrigatória'),
  freguesia: z.string().min(2, 'Freguesia é obrigatória'),
  concelho: z.string().min(2, 'Concelho é obrigatório'),
  distrito: z.string().min(2, 'Distrito é obrigatório'),
  ponto_referencia: z.string().optional(),
  tipo_estrutura: z.enum(['residencial', 'comercial', 'industrial', 'publico', 'misto']),
  nivel_dano: z.enum(['baixo', 'medio', 'alto', 'critico']),
  ano_construcao: z.number().min(1800).max(new Date().getFullYear()).optional(),
  numero_pisos: z.number().min(1).max(50).optional(),
  material_construcao: z.string().optional(),
  necessidades_urgentes: z.array(z.string()).optional(),
  grupos_vulneraveis: z.array(z.string()).optional(),
  perdas_potenciais: z.string().optional(),
  observacoes: z.string().optional(),
  coordenadas: z.object({
    lat: z.number(),
    lng: z.number()
  }).optional()
})

type FormData = z.infer<typeof avaliacaoSchema>

interface FormularioAvaliacaoProps {
  avaliacao?: Assessment
  onSubmit: (data: FieldValues) => Promise<void>
  onCancel: () => void
  loading?: boolean
  modo?: 'criar' | 'editar'
}

const necessidadesOptions = [
  'Água potável',
  'Alimentos',
  'Abrigo temporário',
  'Assistência médica',
  'Medicamentos',
  'Roupas',
  'Produtos de higiene',
  'Combustível',
  'Energia elétrica',
  'Comunicações'
]

const gruposVulneravelisOptions = [
  'Crianças (0-12 anos)',
  'Idosos (65+ anos)',
  'Pessoas com deficiência',
  'Grávidas',
  'Pessoas com doenças crónicas',
  'Famílias monoparentais',
  'Pessoas sem abrigo'
]

export function FormularioAvaliacao({
  avaliacao,
  onSubmit,
  onCancel,
  loading = false,
  modo = 'criar'
}: FormularioAvaliacaoProps) {
  const [autoSaveStatus, setAutoSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [gpsStatus, setGpsStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [selectedNecessidades, setSelectedNecessidades] = useState<string[]>([])
  const [selectedGrupos, setSelectedGrupos] = useState<string[]>([])

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isValid, dirtyFields },
    reset
  } = useForm<FormData>({
    resolver: zodResolver(avaliacaoSchema),
    defaultValues: avaliacao ? {
      titulo: avaliacao.title || '',
      descricao: avaliacao.description || '',
      responsavel_nome: avaliacao.nome_responsavel || '',
      responsavel_telefone: avaliacao.contacto_telefonico || '',
      responsavel_email: '',
      numero_documento: avaliacao.numero_documento || '',
      membros_agregado: avaliacao.membros_agregado || 1,
      morada: avaliacao.endereco_completo || '',
      freguesia: avaliacao.ponto_referencia || '',
      concelho: avaliacao.location?.address || '',
      distrito: '',
      ponto_referencia: avaliacao.ponto_referencia || '',
      tipo_estrutura: 'residencial',
      nivel_dano: 'baixo',
      ano_construcao: undefined,
      numero_pisos: 1,
      material_construcao: '',
      perdas_potenciais: avaliacao.perdas?.join(', ') || '',
      observacoes: avaliacao.notes || '',
      coordenadas: avaliacao.latitude_gps && avaliacao.longitude_gps ? {
        lat: avaliacao.latitude_gps,
        lng: avaliacao.longitude_gps
      } : undefined
    } : {
      membros_agregado: 1,
      tipo_estrutura: 'residencial',
      nivel_dano: 'baixo'
    },
    mode: 'onChange'
  })

  const watchedValues = watch()

  // Auto-save functionality
  useEffect(() => {
    if (modo === 'editar' && Object.keys(dirtyFields).length > 0) {
      const timer = setTimeout(() => {
        setAutoSaveStatus('saving')
        // Simular auto-save
        setTimeout(() => {
          setAutoSaveStatus('saved')
          setTimeout(() => setAutoSaveStatus('idle'), 2000)
        }, 1000)
      }, 2000)

      return () => clearTimeout(timer)
    }
  }, [watchedValues, dirtyFields, modo])

  // Simular captura GPS
  const handleCaptureGPS = () => {
    setGpsStatus('loading')
    
    // Simular coordenadas GPS (Praia, Cabo Verde)
    setTimeout(() => {
      const mockCoords = {
        lat: 14.9218 + (Math.random() - 0.5) * 0.01,
        lng: -23.5087 + (Math.random() - 0.5) * 0.01
      }
      
      setValue('coordenadas', mockCoords, { shouldDirty: true })
      setGpsStatus('success')
      toast.success('Coordenadas GPS capturadas com sucesso')
      
      setTimeout(() => setGpsStatus('idle'), 3000)
    }, 2000)
  }

  const handleNecessidadeChange = (necessidade: string, checked: boolean) => {
    const updated = checked 
      ? [...selectedNecessidades, necessidade]
      : selectedNecessidades.filter(n => n !== necessidade)
    
    setSelectedNecessidades(updated)
    setValue('necessidades_urgentes', updated, { shouldDirty: true })
  }

  const handleGrupoChange = (grupo: string, checked: boolean) => {
    const updated = checked 
      ? [...selectedGrupos, grupo]
      : selectedGrupos.filter(g => g !== grupo)
    
    setSelectedGrupos(updated)
    setValue('grupos_vulneraveis', updated, { shouldDirty: true })
  }

  const onFormSubmit = async (data: FieldValues) => {
    try {
      await onSubmit({
        ...data,
        necessidades_urgentes: selectedNecessidades,
        grupos_vulneraveis: selectedGrupos
      })
    } catch (error) {
      console.error('Erro ao submeter formulário:', error)
      toast.error('Erro ao guardar avaliação')
    }
  }

  const getAutoSaveIcon = () => {
    switch (autoSaveStatus) {
      case 'saving': return <Clock className="h-4 w-4 animate-spin" />
      case 'saved': return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'error': return <XCircle className="h-4 w-4 text-red-500" />
      default: return null
    }
  }

  const getAutoSaveText = () => {
    switch (autoSaveStatus) {
      case 'saving': return 'A guardar...'
      case 'saved': return 'Guardado automaticamente'
      case 'error': return 'Erro ao guardar'
      default: return ''
    }
  }

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      {/* Auto-save Status */}
      {modo === 'editar' && autoSaveStatus !== 'idle' && (
        <Alert>
          <div className="flex items-center gap-2">
            {getAutoSaveIcon()}
            <AlertDescription>{getAutoSaveText()}</AlertDescription>
          </div>
        </Alert>
      )}

      {/* Informações Básicas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Informações Básicas
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="titulo">Título da Avaliação *</Label>
              <Input
                id="titulo"
                {...register('titulo')}
                placeholder="Ex: Avaliação de danos - Casa João Silva"
                className={errors.titulo ? 'border-red-500' : ''}
              />
              {errors.titulo && (
                <p className="text-sm text-red-500 mt-1">{errors.titulo.message}</p>
              )}
            </div>
            
            <div className="md:col-span-2">
              <Label htmlFor="descricao">Descrição *</Label>
              <Textarea
                id="descricao"
                {...register('descricao')}
                placeholder="Descreva brevemente a situação encontrada..."
                rows={3}
                className={errors.descricao ? 'border-red-500' : ''}
              />
              {errors.descricao && (
                <p className="text-sm text-red-500 mt-1">{errors.descricao.message}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Responsável */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Dados do Responsável
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="responsavel_nome">Nome Completo *</Label>
              <Input
                id="responsavel_nome"
                {...register('responsavel_nome')}
                placeholder="Nome do responsável"
                className={errors.responsavel_nome ? 'border-red-500' : ''}
              />
              {errors.responsavel_nome && (
                <p className="text-sm text-red-500 mt-1">{errors.responsavel_nome.message}</p>
              )}
            </div>
            
            <div>
              <Label htmlFor="numero_documento">Número do Documento *</Label>
              <Input
                id="numero_documento"
                {...register('numero_documento')}
                placeholder="BI ou Passaporte"
                className={errors.numero_documento ? 'border-red-500' : ''}
              />
              {errors.numero_documento && (
                <p className="text-sm text-red-500 mt-1">{errors.numero_documento.message}</p>
              )}
            </div>
            
            <div>
              <Label htmlFor="responsavel_telefone">Telefone *</Label>
              <div className="flex">
                <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md">
                  <Phone className="h-4 w-4" />
                </span>
                <Input
                  id="responsavel_telefone"
                  {...register('responsavel_telefone')}
                  placeholder="9XX XX XX XX"
                  className={`rounded-l-none ${errors.responsavel_telefone ? 'border-red-500' : ''}`}
                />
              </div>
              {errors.responsavel_telefone && (
                <p className="text-sm text-red-500 mt-1">{errors.responsavel_telefone.message}</p>
              )}
            </div>
            
            <div>
              <Label htmlFor="responsavel_email">Email</Label>
              <div className="flex">
                <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md">
                  <Mail className="h-4 w-4" />
                </span>
                <Input
                  id="responsavel_email"
                  {...register('responsavel_email')}
                  placeholder="email@exemplo.com"
                  className={`rounded-l-none ${errors.responsavel_email ? 'border-red-500' : ''}`}
                />
              </div>
              {errors.responsavel_email && (
                <p className="text-sm text-red-500 mt-1">{errors.responsavel_email.message}</p>
              )}
            </div>
            
            <div>
              <Label htmlFor="membros_agregado">Membros do Agregado *</Label>
              <div className="flex">
                <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md">
                  <Users className="h-4 w-4" />
                </span>
                <Input
                  id="membros_agregado"
                  type="number"
                  min="1"
                  max="50"
                  {...register('membros_agregado', { valueAsNumber: true })}
                  className={`rounded-l-none ${errors.membros_agregado ? 'border-red-500' : ''}`}
                />
              </div>
              {errors.membros_agregado && (
                <p className="text-sm text-red-500 mt-1">{errors.membros_agregado.message}</p>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="morada">Morada Completa *</Label>
              <Input
                id="morada"
                {...register('morada')}
                placeholder="Rua, número, bairro..."
                className={errors.morada ? 'border-red-500' : ''}
              />
              {errors.morada && (
                <p className="text-sm text-red-500 mt-1">{errors.morada.message}</p>
              )}
            </div>
            
            <div>
              <Label htmlFor="freguesia">Freguesia *</Label>
              <Input
                id="freguesia"
                {...register('freguesia')}
                placeholder="Nome da freguesia"
                className={errors.freguesia ? 'border-red-500' : ''}
              />
              {errors.freguesia && (
                <p className="text-sm text-red-500 mt-1">{errors.freguesia.message}</p>
              )}
            </div>
            
            <div>
              <Label htmlFor="concelho">Concelho *</Label>
              <Input
                id="concelho"
                {...register('concelho')}
                placeholder="Nome do concelho"
                className={errors.concelho ? 'border-red-500' : ''}
              />
              {errors.concelho && (
                <p className="text-sm text-red-500 mt-1">{errors.concelho.message}</p>
              )}
            </div>
            
            <div>
              <Label htmlFor="distrito">Distrito *</Label>
              <Input
                id="distrito"
                {...register('distrito')}
                placeholder="Nome do distrito"
                className={errors.distrito ? 'border-red-500' : ''}
              />
              {errors.distrito && (
                <p className="text-sm text-red-500 mt-1">{errors.distrito.message}</p>
              )}
            </div>
            
            <div>
              <Label htmlFor="ponto_referencia">Ponto de Referência</Label>
              <Input
                id="ponto_referencia"
                {...register('ponto_referencia')}
                placeholder="Ex: Próximo à escola primária"
              />
            </div>
          </div>
          
          {/* GPS Capture */}
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex-1">
              <Label>Coordenadas GPS</Label>
              {watchedValues.coordenadas ? (
                <p className="text-sm text-gray-600">
                  Lat: {watchedValues.coordenadas.lat.toFixed(6)}, 
                  Lng: {watchedValues.coordenadas.lng.toFixed(6)}
                </p>
              ) : (
                <p className="text-sm text-gray-500">Nenhuma coordenada capturada</p>
              )}
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={handleCaptureGPS}
              disabled={gpsStatus === 'loading'}
              className="flex items-center gap-2"
            >
              <MapPin className={`h-4 w-4 ${gpsStatus === 'loading' ? 'animate-pulse' : ''}`} />
              {gpsStatus === 'loading' ? 'A capturar...' : 'Capturar GPS'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Estrutura */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Home className="h-5 w-5" />
            Informações da Estrutura
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="tipo_estrutura">Tipo de Estrutura *</Label>
              <Controller
                name="tipo_estrutura"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger className={errors.tipo_estrutura ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="residencial">Residencial</SelectItem>
                      <SelectItem value="comercial">Comercial</SelectItem>
                      <SelectItem value="industrial">Industrial</SelectItem>
                      <SelectItem value="publico">Público</SelectItem>
                      <SelectItem value="misto">Misto</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.tipo_estrutura && (
                <p className="text-sm text-red-500 mt-1">{errors.tipo_estrutura.message}</p>
              )}
            </div>
            
            <div>
              <Label htmlFor="nivel_dano">Nível de Dano *</Label>
              <Controller
                name="nivel_dano"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger className={errors.nivel_dano ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Selecione o nível" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="baixo">Baixo</SelectItem>
                      <SelectItem value="medio">Médio</SelectItem>
                      <SelectItem value="alto">Alto</SelectItem>
                      <SelectItem value="critico">Crítico</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.nivel_dano && (
                <p className="text-sm text-red-500 mt-1">{errors.nivel_dano.message}</p>
              )}
            </div>
            
            <div>
              <Label htmlFor="ano_construcao">Ano de Construção</Label>
              <Input
                id="ano_construcao"
                type="number"
                min="1800"
                max={new Date().getFullYear()}
                {...register('ano_construcao', { valueAsNumber: true })}
                placeholder="Ex: 1995"
                className={errors.ano_construcao ? 'border-red-500' : ''}
              />
              {errors.ano_construcao && (
                <p className="text-sm text-red-500 mt-1">{errors.ano_construcao.message}</p>
              )}
            </div>
            
            <div>
              <Label htmlFor="numero_pisos">Número de Pisos</Label>
              <Input
                id="numero_pisos"
                type="number"
                min="1"
                max="50"
                {...register('numero_pisos', { valueAsNumber: true })}
                placeholder="Ex: 2"
                className={errors.numero_pisos ? 'border-red-500' : ''}
              />
              {errors.numero_pisos && (
                <p className="text-sm text-red-500 mt-1">{errors.numero_pisos.message}</p>
              )}
            </div>
            
            <div className="md:col-span-2">
              <Label htmlFor="material_construcao">Material de Construção</Label>
              <Input
                id="material_construcao"
                {...register('material_construcao')}
                placeholder="Ex: Betão armado, Pedra, Madeira..."
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Necessidades Urgentes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            Necessidades Urgentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {necessidadesOptions.map((necessidade) => (
              <div key={necessidade} className="flex items-center space-x-2">
                <Checkbox
                  id={`necessidade-${necessidade}`}
                  checked={selectedNecessidades.includes(necessidade)}
                  onCheckedChange={(checked) => 
                    handleNecessidadeChange(necessidade, checked as boolean)
                  }
                />
                <Label 
                  htmlFor={`necessidade-${necessidade}`}
                  className="text-sm font-normal cursor-pointer"
                >
                  {necessidade}
                </Label>
              </div>
            ))}
          </div>
          
          {selectedNecessidades.length > 0 && (
            <div className="mt-4">
              <Label>Necessidades Selecionadas:</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedNecessidades.map((necessidade) => (
                  <Badge key={necessidade} variant="destructive">
                    {necessidade}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Grupos Vulneráveis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Grupos Vulneráveis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {gruposVulneravelisOptions.map((grupo) => (
              <div key={grupo} className="flex items-center space-x-2">
                <Checkbox
                  id={`grupo-${grupo}`}
                  checked={selectedGrupos.includes(grupo)}
                  onCheckedChange={(checked) => 
                    handleGrupoChange(grupo, checked as boolean)
                  }
                />
                <Label 
                  htmlFor={`grupo-${grupo}`}
                  className="text-sm font-normal cursor-pointer"
                >
                  {grupo}
                </Label>
              </div>
            ))}
          </div>
          
          {selectedGrupos.length > 0 && (
            <div className="mt-4">
              <Label>Grupos Selecionados:</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedGrupos.map((grupo) => (
                  <Badge key={grupo} variant="secondary">
                    {grupo}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Observações */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Observações Adicionais
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="perdas_potenciais">Perdas Potenciais</Label>
            <Textarea
              id="perdas_potenciais"
              {...register('perdas_potenciais')}
              placeholder="Descreva as perdas potenciais identificadas..."
              rows={3}
            />
          </div>
          
          <div>
            <Label htmlFor="observacoes">Outras Observações</Label>
            <Textarea
              id="observacoes"
              {...register('observacoes')}
              placeholder="Informações adicionais relevantes..."
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      {/* Ações */}
      <div className="flex items-center justify-between pt-6">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={loading}
        >
          Cancelar
        </Button>
        
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-500">
            {Object.keys(errors).length > 0 && (
              <span className="text-red-500">
                {Object.keys(errors).length} erro(s) encontrado(s)
              </span>
            )}
          </div>
          
          <Button
            type="submit"
            disabled={loading || !isValid}
            className="flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            {loading ? 'A guardar...' : modo === 'criar' ? 'Criar Avaliação' : 'Atualizar Avaliação'}
          </Button>
        </div>
      </div>
    </form>
  )
}
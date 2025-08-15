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

// Schema de validação - Alinhado com o modelo da API
const avaliacaoSchema = z.object({
  nome_responsavel: z.string().min(2, 'Nome do responsável é obrigatório'),
  numero_documento: z.string().min(5, 'Número do documento é obrigatório'),
  contacto_telefonico: z.string().min(9, 'Telefone deve ter pelo menos 9 dígitos'),
  membros_agregado: z.number().min(1, 'Deve ter pelo menos 1 membro').max(50, 'Máximo 50 membros'),
  grupos_vulneraveis: z.array(z.string()).optional(),
  endereco_completo: z.string().min(5, 'Endereço completo é obrigatório'),
  ponto_referencia: z.string().optional(),
  latitude_gps: z.number().optional(),
  longitude_gps: z.number().optional(),
  tipo_estrutura: z.enum(['habitacao', 'comercio', 'agricultura', 'outro']),
  nivel_danos: z.enum(['parcial', 'grave', 'total']),
  perdas: z.array(z.string()).optional(),
  outras_perdas: z.string().optional(),
  necessidade_urgente: z.enum(['agua_potavel', 'alimentacao', 'abrigo_temporario', 'roupas_cobertores', 'medicamentos', 'outros']),
  outra_necessidade: z.string().optional()
})

type FormData = z.infer<typeof avaliacaoSchema>

interface FormularioAvaliacaoProps {
  avaliacao?: Assessment
  onSubmit: (data: FormData) => Promise<void>
  onCancel: () => void
  loading?: boolean
  modo?: 'criar' | 'editar'
}

const necessidadesOptions = [
  { value: 'agua_potavel', label: 'Água potável' },
  { value: 'alimentacao', label: 'Alimentação' },
  { value: 'abrigo_temporario', label: 'Abrigo temporário' },
  { value: 'roupas_cobertores', label: 'Roupas e cobertores' },
  { value: 'medicamentos', label: 'Medicamentos' },
  { value: 'outros', label: 'Outros' }
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

const tipoEstruturaOptions = [
  { value: 'habitacao', label: 'Habitação' },
  { value: 'comercio', label: 'Comércio' },
  { value: 'agricultura', label: 'Agricultura' },
  { value: 'outro', label: 'Outro' }
]

const nivelDanosOptions = [
  { value: 'parcial', label: 'Parcial' },
  { value: 'grave', label: 'Grave' },
  { value: 'total', label: 'Total' }
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
      nome_responsavel: avaliacao.nome_responsavel || '',
      numero_documento: avaliacao.numero_documento || '',
      contacto_telefonico: avaliacao.contacto_telefonico || '',
      membros_agregado: avaliacao.membros_agregado || 1,
      grupos_vulneraveis: avaliacao.grupos_vulneraveis || [],
      endereco_completo: avaliacao.endereco_completo || '',
      ponto_referencia: avaliacao.ponto_referencia || '',
      latitude_gps: avaliacao.latitude_gps,
      longitude_gps: avaliacao.longitude_gps,
      tipo_estrutura: avaliacao.tipo_estrutura || 'habitacao',
      nivel_danos: avaliacao.nivel_danos || 'parcial',
      perdas: avaliacao.perdas || [],
      outras_perdas: avaliacao.outras_perdas || '',
      necessidade_urgente: avaliacao.necessidade_urgente || 'agua_potavel',
      outra_necessidade: avaliacao.outra_necessidade || ''
    } : {
      nome_responsavel: '',
      numero_documento: '',
      contacto_telefonico: '',
      membros_agregado: 1,
      grupos_vulneraveis: [],
      endereco_completo: '',
      ponto_referencia: '',
      tipo_estrutura: 'habitacao',
      nivel_danos: 'parcial',
      perdas: [],
      outras_perdas: '',
      necessidade_urgente: 'agua_potavel',
      outra_necessidade: ''
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
      const mockLat = 14.9218 + (Math.random() - 0.5) * 0.01
      const mockLng = -23.5087 + (Math.random() - 0.5) * 0.01
      
      setValue('latitude_gps', mockLat, { shouldDirty: true })
      setValue('longitude_gps', mockLng, { shouldDirty: true })
      setGpsStatus('success')
      toast.success('Coordenadas GPS capturadas com sucesso')
      
      setTimeout(() => setGpsStatus('idle'), 3000)
    }, 2000)
  }

  const handleGrupoChange = (grupo: string, checked: boolean) => {
    const updated = checked 
      ? [...selectedGrupos, grupo]
      : selectedGrupos.filter(g => g !== grupo)
    
    setSelectedGrupos(updated)
    setValue('grupos_vulneraveis', updated, { shouldDirty: true })
  }

  const handlePerdasChange = (perda: string, checked: boolean) => {
    const currentPerdas = watch('perdas') || []
    const updated = checked 
      ? [...currentPerdas, perda]
      : currentPerdas.filter(p => p !== perda)
    
    setValue('perdas', updated, { shouldDirty: true })
  }



  const onFormSubmit = async (data: FormData) => {
    try {
      await onSubmit({
        ...data,
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
            <div>
              <Label htmlFor="nome_responsavel">Nome do Responsável *</Label>
              <Input
                id="nome_responsavel"
                {...register('nome_responsavel')}
                placeholder="Ex: João Silva"
                className={errors.nome_responsavel ? 'border-red-500' : ''}
              />
              {errors.nome_responsavel && (
                <p className="text-sm text-red-500 mt-1">{errors.nome_responsavel.message}</p>
              )}
            </div>
            
            <div>
              <Label htmlFor="numero_documento">Número do Documento *</Label>
              <Input
                id="numero_documento"
                {...register('numero_documento')}
                placeholder="Ex: 123456789"
                className={errors.numero_documento ? 'border-red-500' : ''}
              />
              {errors.numero_documento && (
                <p className="text-sm text-red-500 mt-1">{errors.numero_documento.message}</p>
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
              <Label htmlFor="contacto_telefonico">Contacto Telefónico *</Label>
              <div className="flex">
                <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md">
                  <Phone className="h-4 w-4" />
                </span>
                <Input
                  id="contacto_telefonico"
                  {...register('contacto_telefonico')}
                  placeholder="9XX XX XX XX"
                  className={`rounded-l-none ${errors.contacto_telefonico ? 'border-red-500' : ''}`}
                />
              </div>
              {errors.contacto_telefonico && (
                <p className="text-sm text-red-500 mt-1">{errors.contacto_telefonico.message}</p>
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
              <Label htmlFor="endereco_completo">Endereço Completo *</Label>
              <Input
                id="endereco_completo"
                {...register('endereco_completo')}
                placeholder="Rua, número, bairro..."
                className={errors.endereco_completo ? 'border-red-500' : ''}
              />
              {errors.endereco_completo && (
                <p className="text-sm text-red-500 mt-1">{errors.endereco_completo.message}</p>
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
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Coordenadas GPS</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleCaptureGPS}
                disabled={gpsStatus === 'loading'}
                className="flex items-center gap-2"
              >
                {gpsStatus === 'loading' ? (
                  <Clock className="h-4 w-4 animate-spin" />
                ) : gpsStatus === 'success' ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <MapPin className="h-4 w-4" />
                )}
                {gpsStatus === 'loading' ? 'Capturando...' : 'Capturar GPS'}
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="latitude_gps">Latitude</Label>
                <Input
                  id="latitude_gps"
                  type="number"
                  step="any"
                  placeholder="Ex: 14.9218"
                  {...register('latitude_gps', { valueAsNumber: true })}
                />
              </div>
              
              <div>
                <Label htmlFor="longitude_gps">Longitude</Label>
                <Input
                  id="longitude_gps"
                  type="number"
                  step="any"
                  placeholder="Ex: -23.5087"
                  {...register('longitude_gps', { valueAsNumber: true })}
                />
              </div>
            </div>
            
            {(watch('latitude_gps') && watch('longitude_gps')) && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                <p className="text-sm text-green-700">
                  <strong>Coordenadas capturadas:</strong><br />
                  Latitude: {watch('latitude_gps')?.toFixed(6)}<br />
                  Longitude: {watch('longitude_gps')?.toFixed(6)}
                </p>
              </div>
            )}
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
                      {tipoEstruturaOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.tipo_estrutura && (
                <p className="text-sm text-red-500 mt-1">{errors.tipo_estrutura.message}</p>
              )}
            </div>
            
            <div>
              <Label htmlFor="nivel_danos">Nível de Dano *</Label>
              <Controller
                name="nivel_danos"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger className={errors.nivel_danos ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Selecione o nível" />
                    </SelectTrigger>
                    <SelectContent>
                      {nivelDanosOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.nivel_danos && (
                <p className="text-sm text-red-500 mt-1">{errors.nivel_danos.message}</p>
              )}
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
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="necessidade_urgente">Necessidade Urgente Principal *</Label>
            <Controller
              name="necessidade_urgente"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger className={errors.necessidade_urgente ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Selecione a necessidade principal" />
                  </SelectTrigger>
                  <SelectContent>
                    {necessidadesOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.necessidade_urgente && (
              <p className="text-sm text-red-500 mt-1">{errors.necessidade_urgente.message}</p>
            )}
          </div>
          
          <div>
            <Label htmlFor="outra_necessidade">Outra Necessidade (opcional)</Label>
            <Textarea 
              id="outra_necessidade"
              {...register('outra_necessidade')}
              placeholder="Descreva outras necessidades específicas..."
              className="min-h-[80px]"
              rows={3}
            />
          </div>
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

      {/* Perdas e Observações */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Perdas e Observações
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <Label>Perdas Identificadas</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {['Habitação', 'Bens móveis', 'Documentos', 'Veículos', 'Animais', 'Culturas'].map((perda) => (
                <div key={perda} className="flex items-center space-x-2">
                  <Checkbox
                    id={`perda-${perda}`}
                    checked={(watch('perdas') || []).includes(perda)}
                    onCheckedChange={(checked) => handlePerdasChange(perda, checked as boolean)}
                  />
                  <Label 
                    htmlFor={`perda-${perda}`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {perda}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="outras_perdas">Outras Perdas</Label>
            <Textarea 
              id="outras_perdas"
              {...register('outras_perdas')}
              placeholder="Descreva outras perdas não listadas acima..."
              className="min-h-[80px]"
              rows={3}
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
'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Home, 
  AlertTriangle, 
  Users, 
  Calendar, 
  Edit, 
  Trash2, 
  Download, 
  Share2,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react'
import { GaleriaEvidencias } from './galeria-evidencias'
import { Assessment } from '@/types'

interface DetalhesAvaliacaoProps {
  avaliacao: Assessment
  onEdit?: () => void
  onDelete?: () => void
  onShare?: () => void
  onDownload?: () => void
  readOnly?: boolean
}

function StatusBadge({ status }: { status: string }) {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'pendente':
        return {
          color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          icon: Clock,
          label: 'Pendente'
        }
      case 'em_andamento':
        return {
          color: 'bg-blue-100 text-blue-800 border-blue-200',
          icon: AlertCircle,
          label: 'Em Andamento'
        }
      case 'concluida':
        return {
          color: 'bg-green-100 text-green-800 border-green-200',
          icon: CheckCircle,
          label: 'Concluída'
        }
      case 'cancelada':
        return {
          color: 'bg-red-100 text-red-800 border-red-200',
          icon: XCircle,
          label: 'Cancelada'
        }
      default:
        return {
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          icon: AlertCircle,
          label: status
        }
    }
  }

  const config = getStatusConfig(status)
  const Icon = config.icon

  return (
    <Badge className={`${config.color} border flex items-center gap-1`}>
      <Icon className="h-3 w-3" />
      {config.label}
    </Badge>
  )
}

function SeveridadeBadge({ nivel }: { nivel: string }) {
  const getSeveridadeConfig = (nivel: string) => {
    switch (nivel) {
      case 'baixo':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'medio':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'alto':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'critico':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getNivelLabel = (nivel: string) => {
    switch (nivel) {
      case 'baixo': return 'Baixo'
      case 'medio': return 'Médio'
      case 'alto': return 'Alto'
      case 'critico': return 'Crítico'
      default: return nivel
    }
  }

  return (
    <Badge className={`${getSeveridadeConfig(nivel)} border`}>
      {getNivelLabel(nivel)}
    </Badge>
  )
}

function SecaoInformacoes({ titulo, children, icon: Icon }: {
  titulo: string
  children: React.ReactNode
  icon: React.ComponentType<{ className?: string }>
}) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Icon className="h-5 w-5" />
          {titulo}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {children}
      </CardContent>
    </Card>
  )
}

function CampoInfo({ label, valor, icon: Icon }: {
  label: string
  valor: string | number | undefined
  icon?: React.ComponentType<{ className?: string }>
}) {
  if (!valor) return null

  return (
    <div className="flex items-start gap-3">
      {Icon && <Icon className="h-4 w-4 mt-0.5 text-gray-500" />}
      <div className="flex-1">
        <div className="text-sm font-medium text-gray-700">{label}</div>
        <div className="text-sm text-gray-900">{valor}</div>
      </div>
    </div>
  )
}

export function DetalhesAvaliacao({
  avaliacao,
  onEdit,
  onDelete,
  onShare,
  onDownload,
  readOnly = false
}: DetalhesAvaliacaoProps) {
  const [activeTab, setActiveTab] = useState('geral')

  // Dados mock para evidências (em produção viriam da API)
  const evidenciasMock = [
    {
      id: '1',
      nome: 'fachada_danos.jpg',
      tipo: 'imagem' as const,
      url: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=damaged%20building%20facade%20after%20disaster&image_size=landscape_4_3',
      tamanho: 2048000,
      data_upload: '2024-01-15T10:30:00Z',
      descricao: 'Danos na fachada principal do edifício',
      categoria: 'danos' as const
    },
    {
      id: '2',
      nome: 'estrutura_interna.jpg',
      tipo: 'imagem' as const,
      url: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=interior%20structural%20damage%20building&image_size=landscape_4_3',
      tamanho: 1536000,
      data_upload: '2024-01-15T10:35:00Z',
      descricao: 'Danos estruturais internos',
      categoria: 'estrutura' as const
    },
    {
      id: '3',
      nome: 'relatorio_tecnico.pdf',
      tipo: 'documento' as const,
      url: '#',
      tamanho: 512000,
      data_upload: '2024-01-15T11:00:00Z',
      descricao: 'Relatório técnico detalhado',
      categoria: 'outros' as const
    }
  ]

  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString('pt-PT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getTipoEstrutura = (tipo: string) => {
    const tipos: Record<string, string> = {
      'habitacao': 'Habitação',
      'comercio': 'Comércio',
      'agricultura': 'Agricultura',
      'outro': 'Outro'
    }
    return tipos[tipo] || tipo
  }

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">{avaliacao.title}</h1>
            <StatusBadge status={avaliacao.status || 'pendente'} />
            <SeveridadeBadge nivel={avaliacao.nivel_danos} />
          </div>
          
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              Criado em {formatarData(avaliacao.data_criacao)}
            </div>
            <div className="flex items-center gap-1">
              <User className="h-4 w-4" />
              {avaliacao.nome_responsavel}
            </div>
          </div>
        </div>

        {!readOnly && (
          <div className="flex items-center gap-2">
            {onShare && (
              <Button variant="outline" size="sm" onClick={onShare}>
                <Share2 className="h-4 w-4 mr-2" />
                Partilhar
              </Button>
            )}
            
            {onDownload && (
              <Button variant="outline" size="sm" onClick={onDownload}>
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
            )}
            
            {onEdit && (
              <Button variant="outline" size="sm" onClick={onEdit}>
                <Edit className="h-4 w-4 mr-2" />
                Editar
              </Button>
            )}
            
            {onDelete && (
              <Button variant="destructive" size="sm" onClick={onDelete}>
                <Trash2 className="h-4 w-4 mr-2" />
                Eliminar
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="geral">Informações Gerais</TabsTrigger>
          <TabsTrigger value="danos">Danos e Necessidades</TabsTrigger>
          <TabsTrigger value="evidencias">Evidências</TabsTrigger>
          <TabsTrigger value="historico">Histórico</TabsTrigger>
        </TabsList>

        <TabsContent value="geral" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Responsável */}
            <SecaoInformacoes titulo="Responsável" icon={User}>
              <CampoInfo label="Nome" valor={avaliacao.nome_responsavel} icon={User} />
              <CampoInfo label="Telefone" valor={avaliacao.contacto_telefonico} icon={Phone} />
              <CampoInfo label="Documento" valor={avaliacao.numero_documento} icon={Mail} />
              <CampoInfo label="Membros do agregado" valor={avaliacao.membros_agregado} icon={Users} />
            </SecaoInformacoes>

            {/* Localização */}
            <SecaoInformacoes titulo="Localização" icon={MapPin}>
              <CampoInfo label="Endereço completo" valor={avaliacao.endereco_completo} icon={MapPin} />
              <CampoInfo label="Ponto de referência" valor={avaliacao.ponto_referencia || 'Não especificado'} />
              {avaliacao.latitude_gps && avaliacao.longitude_gps && (
                <CampoInfo 
                  label="Coordenadas" 
                  valor={`${avaliacao.latitude_gps || 0}, ${avaliacao.longitude_gps || 0}`} 
                />
              )}
            </SecaoInformacoes>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Estrutura */}
            <SecaoInformacoes titulo="Estrutura" icon={Home}>
              <CampoInfo label="Tipo" valor={getTipoEstrutura(avaliacao.tipo_estrutura)} icon={Home} />
              <CampoInfo label="Tipo de estrutura" valor={avaliacao.tipo_estrutura} />
              <CampoInfo label="Endereço" valor={avaliacao.endereco_completo} />
              <CampoInfo label="Ponto de referência" valor={avaliacao.ponto_referencia || 'Não especificado'} />
            </SecaoInformacoes>

            {/* Avaliação */}
            <SecaoInformacoes titulo="Avaliação" icon={AlertTriangle}>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">Nível de Dano:</span>
                <SeveridadeBadge nivel={avaliacao.nivel_danos} />
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">Status:</span>
                <StatusBadge status={avaliacao.status || 'pendente'} />
              </div>
              
              <CampoInfo label="Data da avaliação" valor={formatarData(avaliacao.data_criacao)} icon={Calendar} />
              
              {avaliacao.outras_perdas && (
                <div>
                  <div className="text-sm font-medium text-gray-700 mb-1">Outras Perdas</div>
                  <div className="text-sm text-gray-900 bg-gray-50 p-3 rounded-md">
                    {avaliacao.outras_perdas}
                  </div>
                </div>
              )}
            </SecaoInformacoes>
          </div>
        </TabsContent>

        <TabsContent value="danos" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Necessidades Urgentes */}
            <SecaoInformacoes titulo="Necessidades Urgentes" icon={AlertTriangle}>
              {avaliacao.necessidade_urgente ? (
                 <div className="space-y-2">
                   <Badge variant="destructive" className="text-xs">
                     {avaliacao.necessidade_urgente}
                   </Badge>
                 </div>
               ) : (
                 <p className="text-sm text-gray-500">Nenhuma necessidade urgente identificada</p>
               )}
            </SecaoInformacoes>

            {/* Grupos Vulneráveis */}
            <SecaoInformacoes titulo="Grupos Vulneráveis" icon={Users}>
              {avaliacao.grupos_vulneraveis && avaliacao.grupos_vulneraveis.length > 0 ? (
                <div className="space-y-2">
                  {avaliacao.grupos_vulneraveis?.map((grupo: string, index: number) => (
                    <Badge key={index} variant="secondary" className="mr-2 mb-2">
                      {grupo}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">Nenhum grupo vulnerável identificado</p>
              )}
            </SecaoInformacoes>
          </div>

          {/* Perdas Potenciais */}
          {avaliacao.perdas && avaliacao.perdas.length > 0 && (
            <SecaoInformacoes titulo="Perdas Potenciais" icon={AlertTriangle}>
              <div className="bg-red-50 p-4 rounded-md">
                <p className="text-sm text-red-800">{avaliacao.perdas?.join(', ')}</p>
              </div>
            </SecaoInformacoes>
          )}
        </TabsContent>

        <TabsContent value="evidencias">
          <GaleriaEvidencias
            evidencias={evidenciasMock}
            readOnly={readOnly}
            onUpload={readOnly ? undefined : (files) => {
              console.log('Upload de evidências:', files)
              // Implementar upload
            }}
            onDelete={readOnly ? undefined : (id) => {
              console.log('Eliminar evidência:', id)
              // Implementar eliminação
            }}
          />
        </TabsContent>

        <TabsContent value="historico">
          <SecaoInformacoes titulo="Histórico de Alterações" icon={Clock}>
            <div className="space-y-4">
              <div className="border-l-2 border-blue-200 pl-4">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm font-medium">Avaliação criada</span>
                  <span className="text-xs text-gray-500">{formatarData(avaliacao.data_criacao)}</span>
                </div>
                <p className="text-sm text-gray-600">Avaliação inicial criada por {avaliacao.nome_responsavel}</p>
              </div>
              
              <div className="border-l-2 border-gray-200 pl-4">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  <span className="text-sm font-medium">Última atualização</span>
                  <span className="text-xs text-gray-500">{formatarData(avaliacao.data_criacao)}</span>
                </div>
                <p className="text-sm text-gray-600">Dados atualizados automaticamente</p>
              </div>
            </div>
          </SecaoInformacoes>
        </TabsContent>
      </Tabs>
    </div>
  )
}
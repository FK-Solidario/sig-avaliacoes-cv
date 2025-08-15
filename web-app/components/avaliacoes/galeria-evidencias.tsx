'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { 
  Image as ImageIcon, 
  FileText, 
  Download, 
  Eye, 
  ZoomIn, 
  ZoomOut, 
  RotateCw, 
  X,
  ChevronLeft,
  ChevronRight,
  Upload
} from 'lucide-react'
import Image from 'next/image'

interface Evidencia {
  id: string
  nome: string
  tipo: 'imagem' | 'documento'
  url: string
  tamanho: number
  data_upload: string
  descricao?: string
  categoria?: 'danos' | 'estrutura' | 'pessoas' | 'outros'
}

interface GaleriaEvidenciasProps {
  evidencias: Evidencia[]
  onUpload?: (files: FileList) => void
  onDelete?: (id: string) => void
  readOnly?: boolean
}

interface ViewerImagemProps {
  evidencia: Evidencia
  evidencias: Evidencia[]
  onClose: () => void
  onNext: () => void
  onPrevious: () => void
}

function ViewerImagem({ evidencia, evidencias, onClose, onNext, onPrevious }: ViewerImagemProps) {
  const [zoom, setZoom] = useState(1)
  const [rotation, setRotation] = useState(0)
  
  const currentIndex = evidencias.findIndex(e => e.id === evidencia.id)
  const hasNext = currentIndex < evidencias.length - 1
  const hasPrevious = currentIndex > 0

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.25, 3))
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.25, 0.25))
  const handleRotate = () => setRotation(prev => (prev + 90) % 360)
  const handleReset = () => {
    setZoom(1)
    setRotation(0)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
      {/* Controles superiores */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
        <div className="flex items-center gap-2 text-white">
          <span className="text-sm">
            {currentIndex + 1} de {evidencias.length}
          </span>
          <Badge variant="secondary">
            {evidencia.categoria || 'Outros'}
          </Badge>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleZoomOut}
            disabled={zoom <= 0.25}
            className="text-white hover:bg-white/20"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          
          <span className="text-white text-sm min-w-[60px] text-center">
            {Math.round(zoom * 100)}%
          </span>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleZoomIn}
            disabled={zoom >= 3}
            className="text-white hover:bg-white/20"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRotate}
            className="text-white hover:bg-white/20"
          >
            <RotateCw className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="text-white hover:bg-white/20"
          >
            Reset
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-white hover:bg-white/20"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Navegação lateral */}
      {hasPrevious && (
        <Button
          variant="ghost"
          size="lg"
          onClick={onPrevious}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 z-10"
        >
          <ChevronLeft className="h-8 w-8" />
        </Button>
      )}
      
      {hasNext && (
        <Button
          variant="ghost"
          size="lg"
          onClick={onNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 z-10"
        >
          <ChevronRight className="h-8 w-8" />
        </Button>
      )}

      {/* Imagem */}
      <div className="flex items-center justify-center w-full h-full p-16">
        <div 
          className="relative transition-transform duration-200 ease-in-out"
          style={{ 
            transform: `scale(${zoom}) rotate(${rotation}deg)`,
            maxWidth: '100%',
            maxHeight: '100%'
          }}
        >
          <Image
            src={evidencia.url}
            alt={evidencia.nome}
            width={800}
            height={600}
            className="max-w-full max-h-full object-contain"
            unoptimized
          />
        </div>
      </div>

      {/* Informações inferiores */}
      <div className="absolute bottom-4 left-4 right-4 text-white z-10">
        <div className="bg-black/50 rounded-lg p-4">
          <h3 className="font-semibold mb-1">{evidencia.nome}</h3>
          {evidencia.descricao && (
            <p className="text-sm text-gray-300 mb-2">{evidencia.descricao}</p>
          )}
          <div className="flex items-center gap-4 text-xs text-gray-400">
            <span>Enviado em {new Date(evidencia.data_upload).toLocaleDateString('pt-PT')}</span>
            <span>{(evidencia.tamanho / 1024 / 1024).toFixed(2)} MB</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function CardEvidencia({ evidencia, onView, onDownload, onDelete, readOnly }: {
  evidencia: Evidencia
  onView: () => void
  onDownload: () => void
  onDelete?: () => void
  readOnly?: boolean
}) {
  const getCategoriaColor = (categoria?: string) => {
    switch (categoria) {
      case 'danos': return 'bg-red-100 text-red-800'
      case 'estrutura': return 'bg-blue-100 text-blue-800'
      case 'pessoas': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getCategoriaLabel = (categoria?: string) => {
    switch (categoria) {
      case 'danos': return 'Danos'
      case 'estrutura': return 'Estrutura'
      case 'pessoas': return 'Pessoas'
      default: return 'Outros'
    }
  }

  return (
    <Card className="group hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="aspect-square bg-gray-100 rounded-lg mb-3 relative overflow-hidden">
          {evidencia.tipo === 'imagem' ? (
            <Image
              src={evidencia.url}
              alt={evidencia.nome}
              fill
              className="object-cover transition-transform group-hover:scale-105"
              unoptimized
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <FileText className="h-12 w-12 text-gray-400" />
            </div>
          )}
          
          {/* Overlay com ações */}
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={onView}
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={onDownload}
            >
              <Download className="h-4 w-4" />
            </Button>
            {!readOnly && onDelete && (
              <Button
                variant="destructive"
                size="sm"
                onClick={onDelete}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-sm truncate">{evidencia.nome}</h4>
            <Badge className={`text-xs ${getCategoriaColor(evidencia.categoria)}`}>
              {getCategoriaLabel(evidencia.categoria)}
            </Badge>
          </div>
          
          {evidencia.descricao && (
            <p className="text-xs text-gray-600 line-clamp-2">{evidencia.descricao}</p>
          )}
          
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>{new Date(evidencia.data_upload).toLocaleDateString('pt-PT')}</span>
            <span>{(evidencia.tamanho / 1024 / 1024).toFixed(1)} MB</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function GaleriaEvidencias({ 
  evidencias, 
  onUpload, 
  onDelete, 
  readOnly = false 
}: GaleriaEvidenciasProps) {
  const [viewerEvidencia, setViewerEvidencia] = useState<Evidencia | null>(null)
  const [filtroCategoria, setFiltroCategoria] = useState<string>('')
  const [filtroTipo, setFiltroTipo] = useState<string>('')

  const evidenciasFiltradas = evidencias.filter(evidencia => {
    if (filtroCategoria && evidencia.categoria !== filtroCategoria) return false
    if (filtroTipo && evidencia.tipo !== filtroTipo) return false
    return true
  })

  const evidenciasImagem = evidenciasFiltradas.filter(e => e.tipo === 'imagem')

  const handleView = (evidencia: Evidencia) => {
    if (evidencia.tipo === 'imagem') {
      setViewerEvidencia(evidencia)
    } else {
      // Para documentos, abrir em nova aba
      window.open(evidencia.url, '_blank')
    }
  }

  const handleDownload = (evidencia: Evidencia) => {
    const link = document.createElement('a')
    link.href = evidencia.url
    link.download = evidencia.nome
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleNext = () => {
    if (!viewerEvidencia) return
    const currentIndex = evidenciasImagem.findIndex(e => e.id === viewerEvidencia.id)
    if (currentIndex < evidenciasImagem.length - 1) {
      setViewerEvidencia(evidenciasImagem[currentIndex + 1])
    }
  }

  const handlePrevious = () => {
    if (!viewerEvidencia) return
    const currentIndex = evidenciasImagem.findIndex(e => e.id === viewerEvidencia.id)
    if (currentIndex > 0) {
      setViewerEvidencia(evidenciasImagem[currentIndex - 1])
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files && onUpload) {
      onUpload(files)
    }
  }

  const estatisticas = {
    total: evidencias.length,
    imagens: evidencias.filter(e => e.tipo === 'imagem').length,
    documentos: evidencias.filter(e => e.tipo === 'documento').length,
    tamanhoTotal: evidencias.reduce((acc, e) => acc + e.tamanho, 0)
  }

  return (
    <div className="space-y-6">
      {/* Estatísticas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{estatisticas.total}</div>
            <div className="text-sm text-gray-600">Total</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{estatisticas.imagens}</div>
            <div className="text-sm text-gray-600">Imagens</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{estatisticas.documentos}</div>
            <div className="text-sm text-gray-600">Documentos</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">
              {(estatisticas.tamanhoTotal / 1024 / 1024).toFixed(1)}
            </div>
            <div className="text-sm text-gray-600">MB</div>
          </CardContent>
        </Card>
      </div>

      {/* Ações e Filtros */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5" />
              Evidências ({evidenciasFiltradas.length})
            </CardTitle>
            
            {!readOnly && onUpload && (
              <div>
                <input
                  type="file"
                  id="upload-evidencias"
                  multiple
                  accept="image/*,.pdf,.doc,.docx"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <Button asChild>
                  <label htmlFor="upload-evidencias" className="cursor-pointer">
                    <Upload className="h-4 w-4 mr-2" />
                    Adicionar Evidências
                  </label>
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        
        <CardContent>
          {/* Filtros */}
          <div className="flex gap-4 mb-6">
            <select
              value={filtroCategoria}
              onChange={(e) => setFiltroCategoria(e.target.value)}
              className="px-3 py-2 border rounded-md text-sm"
            >
              <option value="">Todas as categorias</option>
              <option value="danos">Danos</option>
              <option value="estrutura">Estrutura</option>
              <option value="pessoas">Pessoas</option>
              <option value="outros">Outros</option>
            </select>
            
            <select
              value={filtroTipo}
              onChange={(e) => setFiltroTipo(e.target.value)}
              className="px-3 py-2 border rounded-md text-sm"
            >
              <option value="">Todos os tipos</option>
              <option value="imagem">Imagens</option>
              <option value="documento">Documentos</option>
            </select>
          </div>
          
          {/* Grid de evidências */}
          {evidenciasFiltradas.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <ImageIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">Nenhuma evidência encontrada</h3>
              <p className="text-sm">
                {evidencias.length === 0 
                  ? 'Ainda não foram adicionadas evidências a esta avaliação.'
                  : 'Tente ajustar os filtros para ver mais resultados.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {evidenciasFiltradas.map((evidencia) => (
                <CardEvidencia
                  key={evidencia.id}
                  evidencia={evidencia}
                  onView={() => handleView(evidencia)}
                  onDownload={() => handleDownload(evidencia)}
                  onDelete={onDelete ? () => onDelete(evidencia.id) : undefined}
                  readOnly={readOnly}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Viewer de imagem */}
      {viewerEvidencia && (
        <ViewerImagem
          evidencia={viewerEvidencia}
          evidencias={evidenciasImagem}
          onClose={() => setViewerEvidencia(null)}
          onNext={handleNext}
          onPrevious={handlePrevious}
        />
      )}
    </div>
  )
}
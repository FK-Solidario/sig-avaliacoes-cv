'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { 
  Image, 
  ZoomIn, 
  ZoomOut, 
  RotateCw, 
  RotateCcw,
  Download, 
  Share2, 
  Trash2, 
  ChevronLeft, 
  ChevronRight,
  X,
  Maximize,
  Grid3X3,
  List,
  Search,
  Filter,
  Calendar,
  FileText,
  Video,
  Music,
  File,
  Eye,
  MoreVertical
} from 'lucide-react'
import { FileUpload } from './upload-evidencias'
import { toast } from 'sonner'

interface GaleriaEvidenciasAvancadaProps {
  evidencias: FileUpload[]
  onDelete?: (id: string) => void
  onDownload?: (evidencia: FileUpload) => void
  onShare?: (evidencia: FileUpload) => void
  readOnly?: boolean
}

type ViewMode = 'grid' | 'list'
type FilterType = 'todos' | 'foto' | 'documento' | 'video' | 'audio' | 'outro'

interface ViewerState {
  isOpen: boolean
  currentIndex: number
  zoom: number
  rotation: number
  position: { x: number; y: number }
}

const getFileIcon = (category: FileUpload['category'], size = 'h-5 w-5') => {
  switch (category) {
    case 'foto': return <Image className={size} />
    case 'video': return <Video className={size} />
    case 'audio': return <Music className={size} />
    case 'documento': return <FileText className={size} />
    default: return <File className={size} />
  }
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('pt-PT', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

export function GaleriaEvidenciasAvancada({
  evidencias,
  onDelete,
  onDownload,
  onShare,
  readOnly = false
}: GaleriaEvidenciasAvancadaProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [filterType, setFilterType] = useState<FilterType>('todos')
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'size' | 'type'>('date')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  
  const [viewer, setViewer] = useState<ViewerState>({
    isOpen: false,
    currentIndex: 0,
    zoom: 1,
    rotation: 0,
    position: { x: 0, y: 0 }
  })

  // Filtrar e ordenar evidências
  const filteredEvidencias = evidencias
    .filter(evidencia => {
      const matchesFilter = filterType === 'todos' || evidencia.category === filterType
      const matchesSearch = evidencia.name.toLowerCase().includes(searchTerm.toLowerCase())
      return matchesFilter && matchesSearch && evidencia.status === 'completed'
    })
    .sort((a, b) => {
      let comparison = 0
      
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name)
          break
        case 'size':
          comparison = a.size - b.size
          break
        case 'type':
          comparison = a.category.localeCompare(b.category)
          break
        case 'date':
        default:
          // Simular data de criação baseada no ID
          const dateA = parseInt(a.id.split('-')[0])
          const dateB = parseInt(b.id.split('-')[0])
          comparison = dateA - dateB
          break
      }
      
      return sortOrder === 'asc' ? comparison : -comparison
    })

  const openViewer = (index: number) => {
    setViewer({
      isOpen: true,
      currentIndex: index,
      zoom: 1,
      rotation: 0,
      position: { x: 0, y: 0 }
    })
  }

  const closeViewer = () => {
    setViewer(prev => ({ ...prev, isOpen: false }))
  }

  const navigateViewer = (direction: 'prev' | 'next') => {
    const maxIndex = filteredEvidencias.length - 1
    let newIndex = viewer.currentIndex
    
    if (direction === 'prev') {
      newIndex = viewer.currentIndex > 0 ? viewer.currentIndex - 1 : maxIndex
    } else {
      newIndex = viewer.currentIndex < maxIndex ? viewer.currentIndex + 1 : 0
    }
    
    setViewer(prev => ({
      ...prev,
      currentIndex: newIndex,
      zoom: 1,
      rotation: 0,
      position: { x: 0, y: 0 }
    }))
  }

  const zoomViewer = (factor: number) => {
    setViewer(prev => ({
      ...prev,
      zoom: Math.max(0.5, Math.min(3, prev.zoom * factor))
    }))
  }

  const rotateViewer = (degrees: number) => {
    setViewer(prev => ({
      ...prev,
      rotation: (prev.rotation + degrees) % 360
    }))
  }

  const resetViewer = () => {
    setViewer(prev => ({
      ...prev,
      zoom: 1,
      rotation: 0,
      position: { x: 0, y: 0 }
    }))
  }

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!viewer.isOpen) return
      
      switch (e.key) {
        case 'Escape':
          closeViewer()
          break
        case 'ArrowLeft':
          navigateViewer('prev')
          break
        case 'ArrowRight':
          navigateViewer('next')
          break
        case '+':
        case '=':
          zoomViewer(1.2)
          break
        case '-':
          zoomViewer(0.8)
          break
        case 'r':
          rotateViewer(90)
          break
        case 'R':
          rotateViewer(-90)
          break
        case '0':
          resetViewer()
          break
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [viewer.isOpen, viewer.currentIndex])

  const handleDownload = (evidencia: FileUpload) => {
    if (onDownload) {
      onDownload(evidencia)
    } else {
      // Download padrão
      const link = document.createElement('a')
      link.href = evidencia.url || ''
      link.download = evidencia.name
      link.click()
      toast.success('Download iniciado')
    }
  }

  const handleShare = (evidencia: FileUpload) => {
    if (onShare) {
      onShare(evidencia)
    } else {
      // Share padrão
      if (navigator.share) {
        navigator.share({
          title: evidencia.name,
          url: evidencia.url
        })
      } else {
        navigator.clipboard.writeText(evidencia.url || '')
        toast.success('Link copiado para a área de transferência')
      }
    }
  }

  const handleDelete = (evidencia: FileUpload) => {
    if (onDelete) {
      onDelete(evidencia.id)
      toast.success('Evidência removida')
    }
  }

  const currentEvidencia = filteredEvidencias[viewer.currentIndex]

  return (
    <div className="space-y-4">
      {/* Cabeçalho com Filtros */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Image className="h-5 w-5" />
              Galeria de Evidências
              <Badge variant="secondary">
                {filteredEvidencias.length} ficheiro(s)
              </Badge>
            </CardTitle>
            
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Pesquisa */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Pesquisar evidências..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            {/* Filtro por Tipo */}
            <Select value={filterType} onValueChange={(value: FilterType) => setFilterType(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os tipos</SelectItem>
                <SelectItem value="foto">Fotos</SelectItem>
                <SelectItem value="documento">Documentos</SelectItem>
                <SelectItem value="video">Vídeos</SelectItem>
                <SelectItem value="audio">Áudio</SelectItem>
                <SelectItem value="outro">Outros</SelectItem>
              </SelectContent>
            </Select>
            
            {/* Ordenação */}
            <Select value={sortBy} onValueChange={(value: typeof sortBy) => setSortBy(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Data</SelectItem>
                <SelectItem value="name">Nome</SelectItem>
                <SelectItem value="size">Tamanho</SelectItem>
                <SelectItem value="type">Tipo</SelectItem>
              </SelectContent>
            </Select>
            
            {/* Ordem */}
            <Select value={sortOrder} onValueChange={(value: typeof sortOrder) => setSortOrder(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="desc">Descendente</SelectItem>
                <SelectItem value="asc">Ascendente</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Galeria */}
      {filteredEvidencias.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Image className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-500">Nenhuma evidência encontrada</p>
            {searchTerm && (
              <Button
                variant="link"
                onClick={() => setSearchTerm('')}
                className="mt-2"
              >
                Limpar pesquisa
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-6">
            {viewMode === 'grid' ? (
              /* Vista em Grelha */
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                {filteredEvidencias.map((evidencia, index) => (
                  <div
                    key={evidencia.id}
                    className="group relative aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() => openViewer(index)}
                  >
                    {evidencia.category === 'foto' && evidencia.thumbnail ? (
                      <img
                        src={evidencia.thumbnail}
                        alt={evidencia.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        {getFileIcon(evidencia.category, 'h-8 w-8 text-gray-400')}
                      </div>
                    )}
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button size="sm" variant="secondary" className="mr-2">
                          <Eye className="h-4 w-4" />
                        </Button>
                        {!readOnly && (
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDelete(evidencia)
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                    
                    {/* Info */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-2">
                      <p className="text-white text-xs truncate">{evidencia.name}</p>
                      <p className="text-gray-300 text-xs">{formatFileSize(evidencia.size)}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Vista em Lista */
              <div className="space-y-2">
                {filteredEvidencias.map((evidencia, index) => (
                  <div
                    key={evidencia.id}
                    className="flex items-center gap-4 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                    onClick={() => openViewer(index)}
                  >
                    {/* Thumbnail */}
                    <div className="flex-shrink-0">
                      {evidencia.category === 'foto' && evidencia.thumbnail ? (
                        <img
                          src={evidencia.thumbnail}
                          alt={evidencia.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center">
                          {getFileIcon(evidencia.category)}
                        </div>
                      )}
                    </div>
                    
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{evidencia.name}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>{formatFileSize(evidencia.size)}</span>
                        <Badge variant="outline">{evidencia.category}</Badge>
                        <span>{formatDate(new Date(parseInt(evidencia.id.split('-')[0])))}</span>
                      </div>
                    </div>
                    
                    {/* Ações */}
                    {!readOnly && (
                      <div className="flex items-center gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDownload(evidencia)
                          }}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleShare(evidencia)
                          }}
                        >
                          <Share2 className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDelete(evidencia)
                          }}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Visualizador Modal */}
      <Dialog open={viewer.isOpen} onOpenChange={closeViewer}>
        <DialogContent className="max-w-6xl max-h-[90vh] p-0">
          {currentEvidencia && (
            <>
              {/* Cabeçalho */}
              <DialogHeader className="p-4 border-b">
                <div className="flex items-center justify-between">
                  <div>
                    <DialogTitle className="text-lg">{currentEvidencia.name}</DialogTitle>
                    <p className="text-sm text-gray-500">
                      {viewer.currentIndex + 1} de {filteredEvidencias.length} • {formatFileSize(currentEvidencia.size)}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {/* Controles de Zoom e Rotação */}
                    {currentEvidencia.category === 'foto' && (
                      <>
                        <Button size="sm" variant="outline" onClick={() => zoomViewer(0.8)}>
                          <ZoomOut className="h-4 w-4" />
                        </Button>
                        <span className="text-sm px-2">{Math.round(viewer.zoom * 100)}%</span>
                        <Button size="sm" variant="outline" onClick={() => zoomViewer(1.2)}>
                          <ZoomIn className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => rotateViewer(-90)}>
                          <RotateCcw className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => rotateViewer(90)}>
                          <RotateCw className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={resetViewer}>
                          Reset
                        </Button>
                      </>
                    )}
                    
                    {/* Ações */}
                    <Button size="sm" variant="outline" onClick={() => handleDownload(currentEvidencia)}>
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleShare(currentEvidencia)}>
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </DialogHeader>
              
              {/* Conteúdo */}
              <div className="relative flex-1 overflow-hidden bg-gray-100">
                {/* Navegação */}
                {filteredEvidencias.length > 1 && (
                  <>
                    <Button
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10"
                      size="sm"
                      variant="secondary"
                      onClick={() => navigateViewer('prev')}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10"
                      size="sm"
                      variant="secondary"
                      onClick={() => navigateViewer('next')}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </>
                )}
                
                {/* Visualização */}
                <div className="w-full h-96 flex items-center justify-center p-4">
                  {currentEvidencia.category === 'foto' && currentEvidencia.url ? (
                    <img
                      src={currentEvidencia.url}
                      alt={currentEvidencia.name}
                      className="max-w-full max-h-full object-contain transition-transform"
                      style={{
                        transform: `scale(${viewer.zoom}) rotate(${viewer.rotation}deg)`,
                        transformOrigin: 'center'
                      }}
                    />
                  ) : currentEvidencia.category === 'video' && currentEvidencia.url ? (
                    <video
                      src={currentEvidencia.url}
                      controls
                      className="max-w-full max-h-full"
                    />
                  ) : currentEvidencia.category === 'audio' && currentEvidencia.url ? (
                    <audio
                      src={currentEvidencia.url}
                      controls
                      className="w-full max-w-md"
                    />
                  ) : (
                    <div className="text-center">
                      {getFileIcon(currentEvidencia.category, 'h-16 w-16 text-gray-400 mx-auto mb-4')}
                      <p className="text-gray-500">Pré-visualização não disponível</p>
                      <Button
                        className="mt-4"
                        onClick={() => handleDownload(currentEvidencia)}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Descarregar
                      </Button>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Rodapé com Informações */}
              <div className="p-4 border-t bg-gray-50">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <Label className="text-xs text-gray-500">Tipo</Label>
                    <p className="font-medium">{currentEvidencia.category}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500">Tamanho</Label>
                    <p className="font-medium">{formatFileSize(currentEvidencia.size)}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500">Data</Label>
                    <p className="font-medium">
                      {formatDate(new Date(parseInt(currentEvidencia.id.split('-')[0])))}
                    </p>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500">Status</Label>
                    <Badge variant="outline" className="text-xs">
                      {currentEvidencia.status === 'completed' ? 'Carregado' : 'Pendente'}
                    </Badge>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
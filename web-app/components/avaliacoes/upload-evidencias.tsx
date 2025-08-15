'use client'

import { useState, useCallback, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Upload, 
  X, 
  File, 
  Image, 
  FileText, 
  Video, 
  Music,
  CheckCircle,
  AlertCircle,
  Loader2,
  Camera,
  Paperclip
} from 'lucide-react'
import { toast } from 'sonner'

export interface FileUpload {
  id: string
  file: File
  name: string
  size: number
  type: string
  category: 'foto' | 'documento' | 'video' | 'audio' | 'outro'
  status: 'pending' | 'uploading' | 'completed' | 'error'
  progress: number
  url?: string
  thumbnail?: string
  error?: string
}

interface UploadEvidenciasProps {
  onFilesChange: (files: FileUpload[]) => void
  maxFiles?: number
  maxFileSize?: number // em MB
  acceptedTypes?: string[]
  existingFiles?: FileUpload[]
  disabled?: boolean
}

const defaultAcceptedTypes = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'video/mp4',
  'video/avi',
  'video/mov',
  'audio/mp3',
  'audio/wav'
]

const getFileCategory = (type: string): FileUpload['category'] => {
  if (type.startsWith('image/')) return 'foto'
  if (type.startsWith('video/')) return 'video'
  if (type.startsWith('audio/')) return 'audio'
  if (type.includes('pdf') || type.includes('document') || type.includes('text')) return 'documento'
  return 'outro'
}

const getFileIcon = (category: FileUpload['category']) => {
  switch (category) {
    case 'foto': return <Image className="h-5 w-5" />
    case 'video': return <Video className="h-5 w-5" />
    case 'audio': return <Music className="h-5 w-5" />
    case 'documento': return <FileText className="h-5 w-5" />
    default: return <File className="h-5 w-5" />
  }
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export function UploadEvidencias({
  onFilesChange,
  maxFiles = 10,
  maxFileSize = 10, // 10MB
  acceptedTypes = defaultAcceptedTypes,
  existingFiles = [],
  disabled = false
}: UploadEvidenciasProps) {
  const [files, setFiles] = useState<FileUpload[]>(existingFiles)
  const [isDragOver, setIsDragOver] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)

  const updateFiles = useCallback((newFiles: FileUpload[]) => {
    setFiles(newFiles)
    onFilesChange(newFiles)
  }, [onFilesChange])

  const validateFile = (file: File): string | null => {
    if (!acceptedTypes.includes(file.type)) {
      return `Tipo de ficheiro não suportado: ${file.type}`
    }
    
    if (file.size > maxFileSize * 1024 * 1024) {
      return `Ficheiro muito grande. Máximo: ${maxFileSize}MB`
    }
    
    if (files.length >= maxFiles) {
      return `Máximo de ${maxFiles} ficheiros permitidos`
    }
    
    return null
  }

  const createFileUpload = (file: File): FileUpload => {
    return {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      file,
      name: file.name,
      size: file.size,
      type: file.type,
      category: getFileCategory(file.type),
      status: 'pending',
      progress: 0
    }
  }

  const simulateUpload = async (fileUpload: FileUpload): Promise<void> => {
    return new Promise((resolve, reject) => {
      const updateProgress = (progress: number) => {
        setFiles(prev => prev.map(f => 
          f.id === fileUpload.id 
            ? { ...f, progress, status: progress === 100 ? 'completed' : 'uploading' }
            : f
        ))
      }

      // Simular progresso de upload
      let progress = 0
      const interval = setInterval(() => {
        progress += Math.random() * 15
        if (progress >= 100) {
          progress = 100
          clearInterval(interval)
          
          // Simular URL do ficheiro após upload
          const mockUrl = URL.createObjectURL(fileUpload.file)
          setFiles(prev => prev.map(f => 
            f.id === fileUpload.id 
              ? { 
                  ...f, 
                  progress: 100, 
                  status: 'completed',
                  url: mockUrl,
                  thumbnail: fileUpload.category === 'foto' ? mockUrl : undefined
                }
              : f
          ))
          
          resolve()
        } else {
          updateProgress(progress)
        }
      }, 200)

      // Simular possível erro (5% de chance)
      if (Math.random() < 0.05) {
        setTimeout(() => {
          clearInterval(interval)
          setFiles(prev => prev.map(f => 
            f.id === fileUpload.id 
              ? { ...f, status: 'error', error: 'Erro no upload' }
              : f
          ))
          reject(new Error('Erro simulado no upload'))
        }, 1000)
      }
    })
  }

  const handleFiles = async (fileList: FileList) => {
    if (disabled) return

    const newFiles: FileUpload[] = []
    const errors: string[] = []

    Array.from(fileList).forEach(file => {
      const error = validateFile(file)
      if (error) {
        errors.push(`${file.name}: ${error}`)
      } else {
        newFiles.push(createFileUpload(file))
      }
    })

    if (errors.length > 0) {
      toast.error(`Erros encontrados:\n${errors.join('\n')}`)
    }

    if (newFiles.length > 0) {
      const updatedFiles = [...files, ...newFiles]
      updateFiles(updatedFiles)
      
      // Iniciar uploads
      setIsUploading(true)
      
      try {
        await Promise.all(newFiles.map(file => simulateUpload(file)))
        toast.success(`${newFiles.length} ficheiro(s) carregado(s) com sucesso`)
      } catch (error) {
        toast.error('Erro ao carregar alguns ficheiros')
      } finally {
        setIsUploading(false)
      }
    }
  }

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    if (!disabled) {
      setIsDragOver(true)
    }
  }, [disabled])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    
    if (!disabled && e.dataTransfer.files) {
      handleFiles(e.dataTransfer.files)
    }
  }, [disabled])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files)
      e.target.value = '' // Reset input
    }
  }

  const removeFile = (fileId: string) => {
    const updatedFiles = files.filter(f => f.id !== fileId)
    updateFiles(updatedFiles)
    toast.success('Ficheiro removido')
  }

  const retryUpload = async (fileId: string) => {
    const file = files.find(f => f.id === fileId)
    if (file) {
      setFiles(prev => prev.map(f => 
        f.id === fileId 
          ? { ...f, status: 'pending', progress: 0, error: undefined }
          : f
      ))
      
      try {
        await simulateUpload(file)
        toast.success('Upload realizado com sucesso')
      } catch (error) {
        toast.error('Erro no upload')
      }
    }
  }

  const openFileDialog = () => {
    if (!disabled) {
      fileInputRef.current?.click()
    }
  }

  const openCameraDialog = () => {
    if (!disabled) {
      cameraInputRef.current?.click()
    }
  }

  const getStatusColor = (status: FileUpload['status']) => {
    switch (status) {
      case 'completed': return 'text-green-600'
      case 'error': return 'text-red-600'
      case 'uploading': return 'text-blue-600'
      default: return 'text-gray-600'
    }
  }

  const getStatusIcon = (file: FileUpload) => {
    switch (file.status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'error': return <AlertCircle className="h-4 w-4 text-red-600" />
      case 'uploading': return <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
      default: return getFileIcon(file.category)
    }
  }

  const totalFiles = files.length
  const completedFiles = files.filter(f => f.status === 'completed').length
  const errorFiles = files.filter(f => f.status === 'error').length

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Upload de Evidências
          {totalFiles > 0 && (
            <Badge variant="secondary">
              {completedFiles}/{totalFiles} concluídos
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Zona de Drop */}
        <div
          className={`
            border-2 border-dashed rounded-lg p-8 text-center transition-colors
            ${isDragOver 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-300 hover:border-gray-400'
            }
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          `}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={openFileDialog}
        >
          <Upload className={`mx-auto h-12 w-12 mb-4 ${
            isDragOver ? 'text-blue-500' : 'text-gray-400'
          }`} />
          
          <div className="space-y-2">
            <p className="text-lg font-medium">
              {isDragOver 
                ? 'Solte os ficheiros aqui' 
                : 'Arraste ficheiros ou clique para selecionar'
              }
            </p>
            <p className="text-sm text-gray-500">
              Máximo {maxFiles} ficheiros, {maxFileSize}MB cada
            </p>
            <p className="text-xs text-gray-400">
              Formatos: Imagens, PDFs, Documentos, Vídeos, Áudio
            </p>
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={openFileDialog}
            disabled={disabled || totalFiles >= maxFiles}
            className="flex items-center gap-2"
          >
            <Paperclip className="h-4 w-4" />
            Selecionar Ficheiros
          </Button>
          
          <Button
            type="button"
            variant="outline"
            onClick={openCameraDialog}
            disabled={disabled || totalFiles >= maxFiles}
            className="flex items-center gap-2"
          >
            <Camera className="h-4 w-4" />
            Tirar Foto
          </Button>
        </div>

        {/* Inputs ocultos */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={acceptedTypes.join(',')}
          onChange={handleFileSelect}
          className="hidden"
        />
        
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileSelect}
          className="hidden"
        />

        {/* Lista de Ficheiros */}
        {files.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Ficheiros ({totalFiles})</Label>
              {errorFiles > 0 && (
                <Badge variant="destructive">
                  {errorFiles} erro(s)
                </Badge>
              )}
            </div>
            
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {files.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center gap-3 p-3 border rounded-lg bg-gray-50"
                >
                  {/* Thumbnail ou Ícone */}
                  <div className="flex-shrink-0">
                    {file.thumbnail ? (
                      <img
                        src={file.thumbnail}
                        alt={file.name}
                        className="w-10 h-10 object-cover rounded"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center">
                        {getFileIcon(file.category)}
                      </div>
                    )}
                  </div>
                  
                  {/* Informações do Ficheiro */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium truncate">{file.name}</p>
                      <Badge variant="outline" className="text-xs">
                        {file.category}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-4 mt-1">
                      <p className="text-xs text-gray-500">
                        {formatFileSize(file.size)}
                      </p>
                      
                      <div className={`flex items-center gap-1 text-xs ${
                        getStatusColor(file.status)
                      }`}>
                        {getStatusIcon(file)}
                        <span>
                          {file.status === 'completed' && 'Concluído'}
                          {file.status === 'uploading' && `${Math.round(file.progress)}%`}
                          {file.status === 'error' && (file.error || 'Erro')}
                          {file.status === 'pending' && 'Pendente'}
                        </span>
                      </div>
                    </div>
                    
                    {/* Barra de Progresso */}
                    {file.status === 'uploading' && (
                      <Progress value={file.progress} className="mt-2 h-1" />
                    )}
                  </div>
                  
                  {/* Ações */}
                  <div className="flex items-center gap-1">
                    {file.status === 'error' && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => retryUpload(file.id)}
                        className="h-8 w-8 p-0"
                      >
                        <Upload className="h-4 w-4" />
                      </Button>
                    )}
                    
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeFile(file.id)}
                      disabled={file.status === 'uploading'}
                      className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Estatísticas */}
        {totalFiles > 0 && (
          <Alert>
            <AlertDescription>
              <div className="flex items-center justify-between text-sm">
                <span>
                  {completedFiles} de {totalFiles} ficheiros carregados
                </span>
                {isUploading && (
                  <span className="flex items-center gap-1 text-blue-600">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    A carregar...
                  </span>
                )}
              </div>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}
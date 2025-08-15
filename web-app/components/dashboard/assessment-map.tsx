'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { useAssessmentStore } from '@/store/assessments'
import { MapMarker } from '@/types'

// Dynamically import the map component to avoid SSR issues
const DynamicMap = dynamic(
  () => import('./map-component'),
  { 
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-[400px] bg-gray-100 rounded-lg animate-pulse">
        <div className="text-gray-500">Carregando mapa...</div>
      </div>
    )
  }
)

export default function AssessmentMap() {
  const { assessments, fetchAssessments } = useAssessmentStore()
  const [markers, setMarkers] = useState<MapMarker[]>([])
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    fetchAssessments()
  }, [])

  useEffect(() => {
    if (assessments.length > 0) {
      const markers: MapMarker[] = assessments
        .filter(assessment => assessment.location?.latitude && assessment.location?.longitude)
        .map(assessment => ({
          id: assessment.id.toString(),
          position: [assessment.location!.latitude, assessment.location!.longitude] as [number, number],
          title: assessment.title || `Avaliação - ${assessment.nome_responsavel}`,
          severity: assessment.nivel_danos === 'total' ? 'high' : assessment.nivel_danos === 'grave' ? 'medium' : 'low',
          status: assessment.status || 'pending',
          popup: assessment.description || assessment.endereco_completo || 'Sem descrição'
        }))
      
      setMarkers(markers)
    }
  }, [assessments])

  // Don't render anything on server-side
  if (!isClient) {
    return (
      <div className="flex items-center justify-center h-[400px] bg-gray-100 rounded-lg animate-pulse">
        <div className="text-gray-500">Carregando mapa...</div>
      </div>
    )
  }

  if (markers.length === 0) {
    return (
      <div className="flex items-center justify-center h-[400px] bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
        <div className="text-center">
          <p className="text-gray-500 mb-2">Nenhuma avaliação com localização encontrada</p>
          <p className="text-sm text-gray-400">As avaliações com coordenadas GPS aparecerão aqui</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-[400px] w-full">
      <DynamicMap markers={markers} />
    </div>
  )
}
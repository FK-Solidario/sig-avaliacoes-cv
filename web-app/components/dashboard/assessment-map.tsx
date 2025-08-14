'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAssessmentStore } from '@/store/assessments'
import { MapMarker } from '@/types'

// Importação dinâmica do mapa para evitar problemas de SSR
const DynamicMap = dynamic(
  () => import('./map-component'),
  { 
    ssr: false,
    loading: () => (
      <div className="h-[400px] bg-gray-100 rounded-lg flex items-center justify-center">
        <p className="text-gray-500">Carregando mapa...</p>
      </div>
    )
  }
)

export function AssessmentMap() {
  const { assessments, loading, fetchAssessments } = useAssessmentStore()
  const [markers, setMarkers] = useState<MapMarker[]>([])
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    fetchAssessments()
  }, [])

  useEffect(() => {
    if (assessments.length > 0) {
      const mapMarkers: MapMarker[] = assessments
        .filter(assessment => assessment.location?.latitude && assessment.location?.longitude)
        .map(assessment => ({
          id: String(assessment.id),
          position: [assessment.location.latitude, assessment.location.longitude] as [number, number],
          title: assessment.title || 'Avaliação sem nome',
          severity: assessment.severity || 'low',
          status: assessment.status || 'pending',
          popup: `
            <div>
              <h3>${assessment.title || 'Avaliação'}</h3>
              <p>Tipo: ${assessment.disaster_type}</p>
              <p>Status: ${assessment.status}</p>
              <p>Severidade: ${assessment.severity}</p>
            </div>
          `
        }))
      setMarkers(mapMarkers)
    }
  }, [assessments])

  if (!isClient) {
    return (
      <Card className="col-span-full">
        <CardHeader>
          <CardTitle>Mapa de Avaliações</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] bg-gray-100 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">Carregando mapa...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (loading) {
    return (
      <Card className="col-span-full">
        <CardHeader>
          <CardTitle>Mapa de Avaliações</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] bg-gray-100 rounded-lg animate-pulse flex items-center justify-center">
            <p className="text-gray-500">Carregando dados...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle>Mapa de Avaliações</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] rounded-lg overflow-hidden relative">
          <DynamicMap markers={markers} />
          {markers.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-50 bg-opacity-75">
              <p className="text-gray-500">Nenhuma avaliação com localização encontrada</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
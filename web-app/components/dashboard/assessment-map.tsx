/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useEffect, useMemo, useState } from 'react'
import dynamic from 'next/dynamic'
import { useAssessmentStore } from '@/store/assessments'
import { MapMarker } from '@/types'

// Dynamically import the map component to avoid SSR issues with Leaflet
const DynamicMap = dynamic(
  () => import('./map-component'),
  { 
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-full bg-gray-100 rounded-lg animate-pulse">
        <div className="text-gray-500">Carregando mapa...</div>
      </div>
    )
  }
)

export function AssessmentMap() {
  // Pegamos a lista de avaliações do store e não um campo inexistente "markers"
  const assessments = useAssessmentStore((state) => state.assessments)
  const fetchAssessments = useAssessmentStore((state) => state.fetchAssessments)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    const load = async () => {
      try {
        await fetchAssessments()
      } finally {
        if (mounted) setIsLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [fetchAssessments])

  // Converte avaliações em marcadores do mapa, filtrando apenas as que têm coordenadas válidas
  const markers: MapMarker[] = useMemo(() => {
    const mapSeverity = (nivel?: string): string => {
      if (!nivel) return 'default'
      if (nivel === 'total') return 'critical'
      if (nivel === 'grave') return 'high'
      if (nivel === 'parcial') return 'medium'
      return nivel
    }

    return (assessments || [])
      .filter((a: any) => typeof a.latitude_gps === 'number' && typeof a.longitude_gps === 'number')
      .map((a: any) => ({
        id: String(a.id),
        position: [a.latitude_gps as number, a.longitude_gps as number],
        title: a.title || `Avaliação - ${a.nome_responsavel ?? a.id}`,
        severity: mapSeverity(a.nivel_danos),
        status: 'completed',
        popup: a.endereco_completo,
      }))
  }, [assessments])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50 rounded-lg animate-pulse">
        <div className="text-gray-500">Carregando avaliações...</div>
      </div>
    )
  }

  return (
    <div className="h-full w-full">
      <DynamicMap markers={markers} />
    </div>
  )
}

export default AssessmentMap
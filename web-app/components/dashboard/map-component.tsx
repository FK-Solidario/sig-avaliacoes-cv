/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import { Icon } from 'leaflet'
import { useEffect, useState, Component, ErrorInfo, ReactNode } from 'react'
import { Badge } from '@/components/ui/badge'
import { MapMarker } from '@/types'

// Fix for default markers in react-leaflet
if (typeof window !== 'undefined') {
  delete (Icon.Default.prototype as any)._getIconUrl
  Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  })
}

interface DynamicMapProps {
  markers: MapMarker[]
}

interface MapErrorBoundaryProps {
  children: ReactNode
}

interface MapErrorBoundaryState {
  hasError: boolean
  errorKey: number
}

class MapErrorBoundary extends Component<MapErrorBoundaryProps, MapErrorBoundaryState> {
  constructor(props: MapErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, errorKey: 0 }
  }

  static getDerivedStateFromError(): MapErrorBoundaryState {
    return { hasError: true, errorKey: Date.now() }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Map Error:', error, errorInfo)
  }

  handleRetry = () => {
    this.setState({ hasError: false, errorKey: Date.now() })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center h-full min-h-[500px] bg-gray-100 rounded-lg">
          <div className="text-center">
            <p className="text-gray-600 mb-4">Erro ao carregar o mapa.</p>
            <button 
              onClick={this.handleRetry}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Tentar novamente
            </button>
          </div>
        </div>
      )
    }

    return <div key={this.state.errorKey}>{this.props.children}</div>
  }
}

// Adiciona handler para garantir que o mapa seja redimensionado corretamente
function MapResizeHandler() {
  const map = useMap()
  useEffect(() => {
    const resize = () => {
      try {
        map.invalidateSize()
      } catch (error) {
        console.warn('Failed to invalidate map size:', error)
      }
    }

    // Em montagens e após pequenos atrasos para garantir layout calculado
    const t1 = setTimeout(resize, 100)
    const t2 = setTimeout(resize, 400)

    // Listener global de resize da janela
    window.addEventListener('resize', resize)

    // Observa mudanças de tamanho no container do mapa
    const container = map.getContainer()
    let ro: ResizeObserver | undefined
    if (typeof window !== 'undefined' && 'ResizeObserver' in window && container) {
      ro = new ResizeObserver(() => resize())
      ro.observe(container)
    }

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      window.removeEventListener('resize', resize)
      if (ro) ro.disconnect()
    }
  }, [map])
  return null
}

function MapViewController({ markers, defaultCenter, defaultZoom }: { markers: MapMarker[]; defaultCenter: [number, number]; defaultZoom: number }) {
  const map = useMap()

  useEffect(() => {
    if (!map) return

    const safeMarkers = Array.isArray(markers) ? markers : []

    if (safeMarkers.length === 0) {
      map.setView(defaultCenter, defaultZoom)
      return
    }

    // Ajusta a visão para caber todos os marcadores sem depender de window.L
    const latLngs = safeMarkers.map((m) => m.position)
    try {
      // fitBounds aceita um LatLngBoundsExpression, incluindo array de pares [lat, lng]
      map.fitBounds(latLngs as any, { padding: [40, 40] })
    } catch {
      map.setView(defaultCenter, defaultZoom)
    }
  }, [markers, map, defaultCenter, defaultZoom])

  return null
}

function MapContent({ markers }: DynamicMapProps) {
  const defaultCenter: [number, number] = [14.9177, -23.5092]
  const defaultZoom = 11

  return (
    <div className="h-full w-full relative">
      <MapContainer
        center={defaultCenter}
        zoom={defaultZoom}
        style={{ height: '100%', width: '100%', minHeight: '500px' }}
        className="rounded-lg z-0"
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {/* Garante redimensionamento correto do mapa */}
        <MapResizeHandler />
        <MapViewController markers={markers} defaultCenter={defaultCenter} defaultZoom={defaultZoom} />
        {markers.map((marker) => (
          <Marker key={marker.id} position={marker.position}>
            <Popup>
              <div className="p-3 min-w-[250px]">
                <h3 className="font-semibold text-base mb-3">{marker.title}</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600 font-medium">Responsável:</span>
                    <span className="text-sm">{marker.popup || marker.title}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600 font-medium">Severidade:</span>
                    <Badge 
                      variant={marker.severity === 'critical' ? 'destructive' :
                                marker.severity === 'high' ? 'outline' :
                                marker.severity === 'medium' ? 'secondary' : 'default'}
                      className="text-xs"
                    >
                      {marker.severity}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600 font-medium">Status:</span>
                    <Badge 
                      variant={marker.status === 'completed' ? 'default' : 
                             marker.status === 'pending' ? 'secondary' : 'outline'}
                      className="text-xs"
                    >
                      {marker.status}
                    </Badge>
                  </div>
                  <div className="pt-2 border-t">
                    <div className="text-xs text-gray-500">
                      Lat: {marker.position[0].toFixed(6)}, Lng: {marker.position[1].toFixed(6)}
                    </div>
                  </div>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}

export default function DynamicMap({ markers = [] as MapMarker[] }: DynamicMapProps) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return (
      <div className="flex items-center justify-center h-full min-h-[500px] bg-gray-50 rounded-lg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-gray-600">Carregando mapa...</div>
        </div>
      </div>
    )
  }

  if (!Array.isArray(markers) || markers.length === 0) {
    return (
      <div className="flex items-center justify-center h-full min-h-[500px] bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
        <div className="text-center">
          <p className="text-gray-500 mb-2">Nenhuma avaliação com localização encontrada</p>
          <p className="text-sm text-gray-400">As avaliações com coordenadas GPS aparecerão aqui</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full w-full">
      <MapErrorBoundary>
        <MapContent markers={markers} />
      </MapErrorBoundary>
    </div>
  )
}
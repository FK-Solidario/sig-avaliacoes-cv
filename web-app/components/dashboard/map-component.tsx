'use client'

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { Icon } from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useEffect, useState } from 'react'
import { Component, ErrorInfo, ReactNode } from 'react'
import { Badge } from '@/components/ui/badge'
import { MapMarker } from '@/types'
import { getSeverityColor } from '@/lib/utils'

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
}

class MapErrorBoundary extends Component<MapErrorBoundaryProps, MapErrorBoundaryState> {
  constructor(props: MapErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(): MapErrorBoundaryState {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Map Error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center h-[400px] bg-gray-100 rounded-lg">
          <div className="text-center">
            <p className="text-gray-600 mb-2">Erro ao carregar o mapa</p>
            <button 
              onClick={() => this.setState({ hasError: false })}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Tentar novamente
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

interface MapContentProps {
  markers: MapMarker[]
}

function MapContent({ markers }: MapContentProps) {
  return (
    <MapContainer
      center={[-14.235, -51.9253]} // Centro do Brasil
      zoom={4}
      style={{ height: '400px', width: '100%' }}
      className="rounded-lg"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {markers.map((marker) => {
        const iconColor = getSeverityColor(marker.severity)
        
        return (
          <Marker
            key={marker.id}
            position={marker.position}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-semibold text-sm mb-2">{marker.popup || marker.title}</h3>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-600">Local:</span>
                    <span className="text-xs">{marker.title}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-600">Severidade:</span>
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
                    <span className="text-xs text-gray-600">Status:</span>
                    <Badge 
                      variant={marker.status === 'completed' ? 'default' : 
                             marker.status === 'pending' ? 'secondary' : 'outline'}
                      className="text-xs"
                    >
                      {marker.status}
                    </Badge>
                  </div>
                </div>
              </div>
            </Popup>
          </Marker>
        )
      })}
    </MapContainer>
  )
}

export default function DynamicMap({ markers }: DynamicMapProps) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    // Invalidate map size when markers change
    const timer = setTimeout(() => {
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('resize'))
      }
    }, 100)

    return () => clearTimeout(timer)
  }, [markers])

  if (!isMounted) {
    return (
      <div className="flex items-center justify-center h-[400px] bg-gray-100 rounded-lg animate-pulse">
        <div className="text-gray-500">Carregando mapa...</div>
      </div>
    )
  }

  return (
    <MapErrorBoundary>
      <MapContent markers={markers} />
    </MapErrorBoundary>
  )
}
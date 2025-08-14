'use client'

import { useEffect, useRef, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { Badge } from '@/components/ui/badge'
import { MapMarker } from '@/types'
import { getSeverityColor } from '@/lib/utils'

interface DynamicMapProps {
  markers: MapMarker[]
}

// Error boundary component for map
function MapErrorBoundary({ children }: { children: React.ReactNode }) {
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    const handleError = () => setHasError(true)
    window.addEventListener('error', handleError)
    return () => window.removeEventListener('error', handleError)
  }, [])

  if (hasError) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50 rounded-lg">
        <p className="text-gray-500">Erro ao carregar o mapa</p>
      </div>
    )
  }

  return <>{children}</>
}

// Map content component
function MapContent({ markers }: { markers: MapMarker[] }) {
  return (
    <>
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
    </>
  )
}

export default function DynamicMap({ markers }: DynamicMapProps) {
  const [isMounted, setIsMounted] = useState(false)
  const mapRef = useRef<any>(null)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    // Invalidate map size after mount to ensure proper rendering
    if (isMounted && mapRef.current) {
      const map = mapRef.current
      setTimeout(() => {
        if (map && map.invalidateSize) {
          map.invalidateSize()
        }
      }, 100)
    }
  }, [isMounted])

  if (!isMounted) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50 rounded-lg">
        <p className="text-gray-500">Carregando mapa...</p>
      </div>
    )
  }

  return (
    <MapErrorBoundary>
      <div className="h-full w-full relative">
        <MapContainer
          ref={mapRef}
          center={[-14.235, -51.9253]}
          zoom={4}
          style={{ height: '100%', width: '100%' }}
        >
          <MapContent markers={markers} />
        </MapContainer>
      </div>
    </MapErrorBoundary>
  )
}
'use client'

import { useEffect } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useStatisticsStore } from '@/store/statistics'
import { ChartData } from '@/types'

// Cores para cada tipo de desastre
const DISASTER_TYPE_COLORS: Record<string, string> = {
  flood: '#3B82F6', // blue
  earthquake: '#EF4444', // red
  fire: '#F97316', // orange
  storm: '#8B5CF6', // purple
  landslide: '#10B981', // green
  other: '#6B7280', // gray
}

// Tradução dos tipos de desastre
const DISASTER_TYPE_LABELS: Record<string, string> = {
  flood: 'Inundação',
  earthquake: 'Terremoto',
  fire: 'Incêndio',
  storm: 'Tempestade',
  landslide: 'Deslizamento',
  other: 'Outros',
}

interface CustomTooltipProps {
  active?: boolean
  payload?: Array<{
    name: string
    value: number
    payload: ChartData
  }>
}

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const data = payload[0]
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-medium text-gray-900">{data.payload.name}</p>
        <p className="text-sm text-gray-600">
          <span className="font-medium">{data.value}</span> avaliações
        </p>
      </div>
    )
  }
  return null
}

const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
  if (percent < 0.05) return null // Não mostrar label se for menos de 5%
  
  const RADIAN = Math.PI / 180
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)

  return (
    <text 
      x={x} 
      y={y} 
      fill="white" 
      textAnchor={x > cx ? 'start' : 'end'} 
      dominantBaseline="central"
      fontSize={12}
      fontWeight="medium"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  )
}

export function AssessmentsByTypeChart() {
  const { statistics, loading, error, fetchStatistics } = useStatisticsStore()

  useEffect(() => {
    if (!statistics) {
      fetchStatistics()
    }
  }, [statistics, fetchStatistics])

  // Transformar dados para o formato do gráfico
  const chartData: ChartData[] = statistics?.estatisticas_tipo_estrutura
    ? Object.entries(statistics.estatisticas_tipo_estrutura)
        .filter(([_, value]) => (value as number) > 0) // Filtrar tipos com 0 avaliações
        .map(([type, count]) => ({
          name: DISASTER_TYPE_LABELS[type] || type,
          value: count as number,
          color: DISASTER_TYPE_COLORS[type] || '#6B7280',
        }))
        .sort((a, b) => (b.value as number) - (a.value as number)) // Ordenar por valor decrescente
    : []

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Avaliações por Tipo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Avaliações por Tipo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center">
            <div className="text-center">
              <p className="text-red-600 mb-2">Erro ao carregar dados</p>
              <button 
                onClick={fetchStatistics}
                className="text-blue-600 hover:text-blue-800 text-sm underline"
              >
                Tentar novamente
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Avaliações por Tipo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center">
            <p className="text-gray-500">Nenhum dado disponível</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Avaliações por Tipo</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={CustomLabel}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                verticalAlign="bottom" 
                height={36}
                formatter={(value, entry) => (
                  <span style={{ color: entry.color }}>{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
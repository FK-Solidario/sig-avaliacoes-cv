'use client'

import { useEffect, useMemo } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAssessmentStore } from '@/store/assessments'
import { Assessment } from '@/types'

interface MonthlyData {
  month: string
  total: number
  completed: number
  pending: number
  in_progress: number
}

interface CustomTooltipProps {
  active?: boolean
  payload?: Array<{
    name: string
    value: number
    color: string
  }>
  label?: string
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-medium text-gray-900 mb-2">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            <span className="font-medium">{entry.name}:</span> {entry.value}
          </p>
        ))}
      </div>
    )
  }
  return null
}

// Função para obter nome do mês em português
const getMonthName = (monthIndex: number): string => {
  const months = [
    'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
    'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
  ]
  return months[monthIndex]
}

// Função para processar dados de avaliações por mês
const processMonthlyData = (assessments: Assessment[]): MonthlyData[] => {
  const currentDate = new Date()
  const monthsData: MonthlyData[] = []
  
  // Gerar dados dos últimos 6 meses
  for (let i = 5; i >= 0; i--) {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1)
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
    
    // Filtrar avaliações do mês
    const monthAssessments = assessments.filter(assessment => {
      const assessmentDate = new Date(assessment.data_criacao)
      const assessmentMonthKey = `${assessmentDate.getFullYear()}-${String(assessmentDate.getMonth() + 1).padStart(2, '0')}`
      return assessmentMonthKey === monthKey
    })
    
    const completed = monthAssessments.filter(a => a.status === 'completed').length
    const pending = monthAssessments.filter(a => a.status === 'pending').length
    const in_progress = monthAssessments.filter(a => a.status === 'in_progress').length
    
    monthsData.push({
      month: getMonthName(date.getMonth()),
      total: monthAssessments.length,
      completed,
      pending,
      in_progress
    })
  }
  
  return monthsData
}

// Dados simulados para demonstração (caso não haja dados reais)
const generateMockData = (): MonthlyData[] => {
  const currentDate = new Date()
  const mockData: MonthlyData[] = []
  
  for (let i = 5; i >= 0; i--) {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1)
    const baseValue = Math.floor(Math.random() * 20) + 10
    
    const completed = Math.floor(baseValue * 0.6)
    const in_progress = Math.floor(baseValue * 0.25)
    const pending = baseValue - completed - in_progress
    
    mockData.push({
      month: getMonthName(date.getMonth()),
      total: baseValue,
      completed,
      pending,
      in_progress
    })
  }
  
  return mockData
}

export function MonthlyTrendChart() {
  const { assessments, loading, error, fetchAssessments } = useAssessmentStore()

  useEffect(() => {
    if (assessments.length === 0) {
      fetchAssessments()
    }
  }, [assessments.length, fetchAssessments])

  const chartData = useMemo(() => {
    if (assessments.length > 0) {
      return processMonthlyData(assessments)
    }
    // Usar dados simulados se não houver dados reais
    return generateMockData()
  }, [assessments])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Tendência Mensal</CardTitle>
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
          <CardTitle>Tendência Mensal</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center">
            <div className="text-center">
              <p className="text-red-600 mb-2">Erro ao carregar dados</p>
              <button 
                onClick={fetchAssessments}
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tendência Mensal</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="month" 
                stroke="#666"
                fontSize={12}
              />
              <YAxis 
                stroke="#666"
                fontSize={12}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="total" 
                stroke="#3B82F6" 
                strokeWidth={2}
                name="Total"
                dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#3B82F6', strokeWidth: 2 }}
              />
              <Line 
                type="monotone" 
                dataKey="completed" 
                stroke="#10B981" 
                strokeWidth={2}
                name="Concluídas"
                dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#10B981', strokeWidth: 2 }}
              />
              <Line 
                type="monotone" 
                dataKey="in_progress" 
                stroke="#F59E0B" 
                strokeWidth={2}
                name="Em Progresso"
                dot={{ fill: '#F59E0B', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#F59E0B', strokeWidth: 2 }}
              />
              <Line 
                type="monotone" 
                dataKey="pending" 
                stroke="#EF4444" 
                strokeWidth={2}
                name="Pendentes"
                dot={{ fill: '#EF4444', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#EF4444', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
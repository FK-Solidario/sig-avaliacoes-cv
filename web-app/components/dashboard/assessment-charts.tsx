'use client';

import { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useStatisticsStore } from '@/store/statistics';
import { AssessmentsByTypeChart } from './assessments-by-type-chart';
import { MonthlyTrendChart } from './monthly-trend-chart';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';

// Color constants for charts
const PIE_COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];
const COLORS = {
  primary: '#0088FE',
  secondary: '#00C49F',
  accent: '#FFBB28'
};

interface AssessmentChartsProps {
  className?: string;
}

export function AssessmentCharts({ className = '' }: AssessmentChartsProps) {
  const { statistics, fetchStatistics, loading, error } = useStatisticsStore();

  useEffect(() => {
    fetchStatistics();
  }, [fetchStatistics]);

  // Dados para o gráfico de pizza (por tipo de desastre)
  const pieData = statistics ? 
    Object.entries(statistics.estatisticas_tipo_estrutura).map(([type, count]) => ({
      name: type,
      value: Number(count),
      percentage: statistics.total_avaliacoes > 0 ? ((count / statistics.total_avaliacoes) * 100).toFixed(1) : '0'
    })) : [];

  // Mock data para tendência mensal já que não existe na API
  const totalAvaliacoes = statistics?.total_avaliacoes || 0
  const lineData = [
    { month: 'Jan', assessments: Math.floor(totalAvaliacoes * 0.1) },
    { month: 'Fev', assessments: Math.floor(totalAvaliacoes * 0.15) },
    { month: 'Mar', assessments: Math.floor(totalAvaliacoes * 0.2) },
    { month: 'Abr', assessments: Math.floor(totalAvaliacoes * 0.25) },
    { month: 'Mai', assessments: Math.floor(totalAvaliacoes * 0.15) },
    { month: 'Jun', assessments: Math.floor(totalAvaliacoes * 0.15) }
  ];

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percentage }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize={12}
        fontWeight="bold"
      >
        {`${percentage}%`}
      </text>
    );
  };

  if (loading) {
    return (
      <div className={`grid grid-cols-1 lg:grid-cols-2 gap-6 ${className}`}>
        <Card>
          <CardHeader>
            <CardTitle>Avaliações por Tipo</CardTitle>
            <CardDescription>Distribuição por tipo de desastre</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Tendência Mensal</CardTitle>
            <CardDescription>Número de avaliações por mês</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`grid grid-cols-1 lg:grid-cols-2 gap-6 ${className}`}>
        <Card>
          <CardHeader>
            <CardTitle>Avaliações por Tipo</CardTitle>
            <CardDescription>Distribuição por tipo de desastre</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center text-destructive">
              <p>Erro ao carregar dados: {error}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Tendência Mensal</CardTitle>
            <CardDescription>Número de avaliações por mês</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center text-destructive">
              <p>Erro ao carregar dados: {error}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 lg:grid-cols-2 gap-6 ${className}`}>
      {/* Gráfico de Pizza - Avaliações por Tipo */}
      <Card>
        <CardHeader>
          <CardTitle>Avaliações por Tipo</CardTitle>
          <CardDescription>Distribuição por tipo de desastre</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomizedLabel}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: any, name: any) => [`${value} avaliações`, name]}
                  />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36}
                    formatter={(value) => value}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                <p>Nenhum dado disponível</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Gráfico de Linha - Tendência Mensal */}
      <Card>
        <CardHeader>
          <CardTitle>Tendência Mensal</CardTitle>
          <CardDescription>Número de avaliações por mês</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={lineData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="month" 
                  axisLine={false}
                  tickLine={false}
                  className="text-xs"
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  className="text-xs"
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px'
                  }}
                  formatter={(value: any) => [`${value} avaliações`, 'Total']}
                />
                <Line 
                  type="monotone" 
                  dataKey="assessments" 
                  stroke={COLORS.primary} 
                  strokeWidth={2} 
                  dot={{ fill: COLORS.primary, strokeWidth: 2, r: 4 }} 
                  activeDot={{ r: 6, stroke: COLORS.primary, strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
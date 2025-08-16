'use client'

import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import AssessmentMap from '@/components/dashboard/assessment-map'

export default function MapaPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      {/* Header com botão de voltar */}
      <div className="flex items-center justify-between space-y-2">
        <div className="flex items-center space-x-4">
          <Link href="/">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar ao Dashboard
            </Button>
          </Link>
          <h2 className="text-3xl font-bold tracking-tight">Mapa de Avaliações</h2>
        </div>
      </div>
      
      {/* Descrição */}
      <div className="bg-white p-4 rounded-lg border shadow-sm">
        <p className="text-gray-600">
          Visualize todas as avaliações de desastres em um mapa interativo. 
          Clique nos marcadores para ver detalhes de cada avaliação, incluindo severidade, status e localização.
        </p>
      </div>
      
      {/* Mapa em tela cheia */}
      <div className="bg-white rounded-lg border shadow-sm p-4">
        <div className="h-[calc(100vh-280px)] min-h-[600px]">
          <AssessmentMap />
        </div>
        {/* Dados de avaliação ocultos para processamento */}
        <div id="user-input-data" style={{ display: 'none' }}>
          {`[
            { 
              "id": 2, 
              "nome_responsavel": "Francisco", 
              "numero_documento": "123456", 
              "contacto_telefonico": "238123456", 
              "membros_agregado": 5, 
              "grupos_vulneraveis": [ 
                "Crianças (0-12 anos)", 
                "Idosos (65+ anos)" 
              ], 
              "endereco_completo": "Praça", 
              "ponto_referencia": "", 
              "latitude_gps": 14.926397204881596, 
              "longitude_gps": -23.5092781323137, 
              "tipo_estrutura": "habitacao", 
              "nivel_danos": "parcial", 
              "perdas": [ 
                "Habitação", 
                "Veículos" 
              ], 
              "outras_perdas": "sdffds", 
              "ficheiros_prova": [], 
              "necessidade_urgente": "medicamentos", 
              "outra_necessidade": "dsfsdf", 
              "data_criacao": "2025-08-15T17:41:05.927849", 
              "data_atualizacao": "2025-08-15T17:41:05.927856" 
            }, 
            { 
              "id": 4, 
              "nome_responsavel": "Benvindo Costa", 
              "numero_documento": "01221989M01S", 
              "contacto_telefonico": "2385161472", 
              "membros_agregado": 1, 
              "grupos_vulneraveis": [], 
              "endereco_completo": "Terra Branca", 
              "ponto_referencia": "Perto de pao quente", 
              "latitude_gps": 14.919792201101858, 
              "longitude_gps": -23.50617882119652, 
              "tipo_estrutura": "habitacao", 
              "nivel_danos": "parcial", 
              "perdas": [ 
                "Habitação", 
                "Bens móveis" 
              ], 
              "outras_perdas": "", 
              "ficheiros_prova": [], 
              "necessidade_urgente": "alimentacao", 
              "outra_necessidade": "", 
              "data_criacao": "2025-08-15T17:50:32.402314", 
              "data_atualizacao": "2025-08-15T17:50:32.402320" 
            }, 
            { 
              "id": 5, 
              "nome_responsavel": "Elson", 
              "numero_documento": "01221989M015", 
              "contacto_telefonico": "2385161472", 
              "membros_agregado": 1, 
              "grupos_vulneraveis": [], 
              "endereco_completo": "Terra Branca", 
              "ponto_referencia": "Perto de pao quente", 
              "latitude_gps": 14.922387528607942, 
              "longitude_gps": -23.504993550320684, 
              "tipo_estrutura": "comercio", 
              "nivel_danos": "parcial", 
              "perdas": [], 
              "outras_perdas": "", 
              "ficheiros_prova": [], 
              "necessidade_urgente": "abrigo_temporario", 
              "outra_necessidade": "", 
              "data_criacao": "2025-08-15T20:55:18.245460", 
              "data_atualizacao": "2025-08-15T20:55:18.245466" 
            } 
          ]`}
        </div>
      </div>
    </div>
  )
}
import { AvaliacaoDesastre, Estatisticas } from '@/types'

// Mock data for assessments
export const mockAvaliacoes: AvaliacaoDesastre[] = [
  {
    id: 1,
    nome_responsavel: 'João Silva',
    contacto_telefonico: '+238 555 0001',
    numero_documento: 'CV123456789',
    endereco_completo: 'Praia, Santiago, Cabo Verde',
    latitude_gps: 14.9177,
    longitude_gps: -23.5092,
    ponto_referencia: 'Próximo ao mercado central',
    tipo_estrutura: 'habitacao',
    nivel_danos: 'parcial',
    membros_agregado: 4,
    grupos_vulneraveis: ['criancas', 'idosos'],
    perdas: ['mobiliario', 'eletrodomesticos'],
    outras_perdas: 'Documentos pessoais',
    necessidade_urgente: 'abrigo_temporario',
    data_criacao: new Date().toISOString(),
    data_atualizacao: new Date().toISOString()
  },
  {
    id: 2,
    nome_responsavel: 'Maria Santos',
    contacto_telefonico: '+238 555 0002',
    numero_documento: 'CV987654321',
    endereco_completo: 'Mindelo, São Vicente, Cabo Verde',
    latitude_gps: 16.8866,
    longitude_gps: -24.9956,
    ponto_referencia: 'Escola primária local',
    tipo_estrutura: 'comercio',
    nivel_danos: 'grave',
    membros_agregado: 2,
    grupos_vulneraveis: ['deficientes'],
    perdas: ['stock', 'equipamentos'],
    outras_perdas: 'Perda de clientes',
    necessidade_urgente: 'outros',
    data_criacao: new Date().toISOString(),
    data_atualizacao: new Date().toISOString()
  },
  {
    id: 3,
    nome_responsavel: 'António Pereira',
    contacto_telefonico: '+238 555 0003',
    numero_documento: 'CV456789123',
    endereco_completo: 'Santa Maria, Sal, Cabo Verde',
    latitude_gps: 16.5988,
    longitude_gps: -22.9094,
    ponto_referencia: 'Hotel Belorizonte',
    tipo_estrutura: 'agricultura',
    nivel_danos: 'total',
    membros_agregado: 6,
    grupos_vulneraveis: ['criancas'],
    perdas: ['culturas', 'animais'],
    outras_perdas: 'Ferramentas agrícolas',
    necessidade_urgente: 'agua_potavel',
    data_criacao: new Date().toISOString(),
    data_atualizacao: new Date().toISOString()
  },
  {
    id: 4,
    nome_responsavel: 'Carla Monteiro',
    contacto_telefonico: '+238 555 0004',
    numero_documento: 'CV789123456',
    endereco_completo: 'Assomada, Santiago, Cabo Verde',
    latitude_gps: 15.1067,
    longitude_gps: -23.6775,
    ponto_referencia: 'Centro de saúde',
    tipo_estrutura: 'habitacao',
    nivel_danos: 'grave',
    membros_agregado: 8,
    grupos_vulneraveis: ['criancas', 'gravidas'],
    perdas: ['mobiliario', 'eletrodomesticos', 'roupas'],
    outras_perdas: 'Medicamentos essenciais',
    necessidade_urgente: 'medicamentos',
    data_criacao: new Date().toISOString(),
    data_atualizacao: new Date().toISOString()
  },
  {
    id: 5,
    nome_responsavel: 'Pedro Tavares',
    contacto_telefonico: '+238 555 0005',
    numero_documento: 'CV321654987',
    endereco_completo: 'Porto Novo, Santo Antão, Cabo Verde',
    latitude_gps: 17.0178,
    longitude_gps: -25.0581,
    ponto_referencia: 'Mercado municipal',
    tipo_estrutura: 'comercio',
    nivel_danos: 'parcial',
    membros_agregado: 3,
    grupos_vulneraveis: ['idosos'],
    perdas: ['stock', 'equipamentos'],
    outras_perdas: 'Sistema de refrigeração',
    necessidade_urgente: 'alimentacao',
    data_criacao: new Date().toISOString(),
    data_atualizacao: new Date().toISOString()
  }
]

// Mock statistics data - Enhanced for better dashboard demonstration
export const mockEstatisticas: Estatisticas = {
  total_avaliacoes: 47,
  estatisticas_tipo_estrutura: {
    habitacao: 28,
    comercio: 12,
    agricultura: 5,
    outro: 2
  },
  estatisticas_nivel_danos: {
    parcial: 22,
    grave: 18,
    total: 7
  },
  estatisticas_necessidade_urgente: {
    agua_potavel: 15,
    abrigo_temporario: 12,
    alimentacao: 8,
    medicamentos: 7,
    roupas_cobertores: 3,
    outros: 2
  }
}

// Mock options data
export const mockOpcoes = {
  tipos_estrutura: ['habitacao', 'comercio', 'agricultura', 'outro'],
  niveis_danos: ['total', 'parcial', 'grave'],
  grupos_vulneraveis: ['criancas', 'idosos', 'deficientes', 'gravidas'],
  tipos_perdas: ['mobiliario', 'eletrodomesticos', 'stock', 'equipamentos', 'culturas', 'animais'],
  necessidades_urgentes: ['agua_potavel', 'alimentacao', 'abrigo_temporario', 'roupas_cobertores', 'medicamentos', 'outros']
}
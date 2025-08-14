// User and Authentication Types
export interface User {
  id: string
  email: string
  name: string
  role: 'coordinator' | 'field_team'
  created_at: string
  updated_at: string
}

// Compatibilidade com LoginResponse
export interface AuthUser {
  access_token: string
  token_type: string
  expires_in: number
  user?: {
    id: number
    email: string
    name: string
    role: string
  }
}

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  access_token: string
  token_type: string
  user: User
}

// Assessment Types - Based on Swagger API
export interface AvaliacaoDesastre {
  id: number
  nome_responsavel: string
  numero_documento: string
  contacto_telefonico: string
  membros_agregado: number
  grupos_vulneraveis?: string[]
  endereco_completo: string
  ponto_referencia?: string
  latitude_gps?: number
  longitude_gps?: number
  tipo_estrutura: 'habitacao' | 'comercio' | 'agricultura' | 'outro'
  nivel_danos: 'parcial' | 'grave' | 'total'
  perdas?: string[]
  outras_perdas?: string
  ficheiros_prova?: string[]
  necessidade_urgente: 'agua_potavel' | 'alimentacao' | 'abrigo_temporario' | 'roupas_cobertores' | 'medicamentos' | 'outros'
  outra_necessidade?: string
  data_criacao: string
  data_atualizacao: string
}

export interface EntradaAvaliacao {
  nome_responsavel: string
  numero_documento: string
  contacto_telefonico: string
  membros_agregado: number
  grupos_vulneraveis?: string[]
  endereco_completo: string
  ponto_referencia?: string
  latitude_gps?: number
  longitude_gps?: number
  tipo_estrutura: 'habitacao' | 'comercio' | 'agricultura' | 'outro'
  nivel_danos: 'parcial' | 'grave' | 'total'
  perdas?: string[]
  outras_perdas?: string
  necessidade_urgente: 'agua_potavel' | 'alimentacao' | 'abrigo_temporario' | 'roupas_cobertores' | 'medicamentos' | 'outros'
  outra_necessidade?: string
}

// Legacy types for compatibility
export interface Assessment extends AvaliacaoDesastre {
  title: string
  description: string
  location: {
    latitude: number
    longitude: number
    address: string
  }
  disaster_type: string
  severity: string
  status: string
  assigned_to: string | null
  created_by: string
  completed_at: string | null
  estimated_damage: number | null
  affected_people: number | null
  notes: string | null
}

export interface CreateAssessmentRequest extends EntradaAvaliacao {}
export interface UpdateAssessmentRequest extends Partial<EntradaAvaliacao> {}

// Evidence Types
export interface Evidence {
  id: string
  assessment_id: string
  file_url: string
  file_type: 'image' | 'video' | 'document'
  description: string | null
  uploaded_by: string
  uploaded_at: string
}

export interface UploadEvidenceRequest {
  file: File
  description?: string
}

// Statistics Types - Based on Swagger API
export interface Estatisticas {
  total_avaliacoes: number
  estatisticas_nivel_danos: Record<string, number>
  estatisticas_tipo_estrutura: Record<string, number>
  estatisticas_necessidade_urgente: Record<string, number>
}

// Options Types - Based on Swagger API
export interface Opcoes {
  grupos_vulneraveis: string[]
  tipos_estrutura: string[]
  niveis_danos: string[]
  tipos_perdas: string[]
  necessidades_urgentes: string[]
}

// Legacy statistics type for compatibility
export interface AssessmentStatistics extends Estatisticas {
  pending_assessments: number
  in_progress_assessments: number
  completed_assessments: number
  cancelled_assessments: number
  assessments_by_type: Record<string, number>
  assessments_by_severity: Record<string, number>
  total_estimated_damage: number
  total_affected_people: number
}

// API Response Types
export interface ApiResponse<T> {
  data: T
  message?: string
  success: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  per_page: number
  total_pages: number
}

// Form Types
export interface AssessmentFormData {
  title: string
  description: string
  latitude: number
  longitude: number
  address: string
  disaster_type: string
  severity: string
  assigned_to?: string
  estimated_damage?: number
  affected_people?: number
  notes?: string
}

// Map Types
export interface MapMarker {
  id: string
  position: [number, number]
  title: string
  severity: string
  status: string
  popup?: string
}

// Chart Types
export interface ChartData {
  name: string
  value: number
  color?: string
}

// Store Types
export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  setUser: (user: User) => void
}

export interface AssessmentState {
  assessments: Assessment[]
  currentAssessment: Assessment | null
  loading: boolean
  error: string | null
  fetchAssessments: () => Promise<void>
  fetchAssessment: (id: string) => Promise<void>
  createAssessment: (data: CreateAssessmentRequest) => Promise<void>
  updateAssessment: (id: string, data: UpdateAssessmentRequest) => Promise<void>
  deleteAssessment: (id: string) => Promise<void>
  setCurrentAssessment: (assessment: Assessment | null) => void
}

export interface StatisticsState {
  statistics: Estatisticas | null
  options: Opcoes | null
  loading: boolean
  error: string | null
  fetchStatistics: () => Promise<void>
  fetchOptions: () => Promise<void>
}

// API Filter Types
export interface AvaliacaoFilters {
  necessidade_urgente?: string
  tipo_estrutura?: string
  nivel_danos?: string
  page?: number
  per_page?: number
}
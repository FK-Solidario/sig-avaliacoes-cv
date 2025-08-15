import axios, { AxiosInstance, AxiosResponse } from 'axios'
import {
  LoginRequest,
  LoginResponse,
  Login,
  Token,
  Utilizador,
  Registo,
  VerificarToken,
  RespostaVerificacao,
  AlterarSenha,
  SolicitarReset,
  RespostaReset,
  ResetSenha,
  Assessment,
  CreateAssessmentRequest,
  UpdateAssessmentRequest,
  Evidence,
  UploadEvidenceRequest,
  AssessmentStatistics,
  ApiResponse,
  PaginatedResponse,
  AvaliacaoDesastre,
  EntradaAvaliacao,
  Estatisticas,
  Opcoes,
  AvaliacaoFilters,
  RegistarUtilizador,
  AtualizarUtilizador
} from '@/types'
import { mockAvaliacoes, mockEstatisticas, mockOpcoes } from './mock-data'

class ApiService {
  private api: AxiosInstance
  private baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://84.247.171.243:5000/api'

  constructor() {
    this.api = axios.create({
      baseURL: this.baseURL,
      timeout: 10000, // 10 seconds timeout
      headers: {
        'Content-Type': 'application/json',
      },
    })

    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('auth_token')
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )

    // Response interceptor for error handling with retry logic
    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config
        
        // If it's a network error or timeout, and we haven't retried yet
        if ((error.code === 'ECONNABORTED' || error.code === 'NETWORK_ERROR' || !error.response) && !originalRequest._retry) {
          originalRequest._retry = true
          console.warn('API request failed, retrying once...', error.message)
          
          try {
            return await this.api.request(originalRequest)
          } catch (retryError) {
            console.error('API retry failed, falling back to mock data:', retryError)
            return Promise.reject(retryError)
          }
        }
        
        if (error.response?.status === 401) {
          // Token expired or invalid
          localStorage.removeItem('auth_token')
          localStorage.removeItem('user')
          window.location.href = '/login'
        }
        
        console.error('API Error:', error)
        return Promise.reject(error)
      }
    )
  }

  // Authentication endpoints - Based on Swagger API
  async login(credentials: Login): Promise<Token> {
    const response = await this.api.post('/autenticacao/login', credentials)
    const apiResponse = response.data
    
    // API returns 'token' but our interface expects 'access_token'
    // Map the API response to our expected format
    const tokenData: Token = {
      access_token: apiResponse.token,
      token_type: apiResponse.tipo || 'Bearer',
      expires_in: 86400, // Default 24 hours
      utilizador: apiResponse.utilizador
    }
    
    if (!tokenData.access_token) {
      throw new Error('Token de acesso não encontrado na resposta')
    }
    
    this.setAuthToken(tokenData.access_token)
    
    // Store user info if available in token response
    if (tokenData.utilizador) {
      localStorage.setItem('user', JSON.stringify(tokenData.utilizador))
    }
    
    return tokenData
  }

  async verificarToken(data: VerificarToken): Promise<RespostaVerificacao> {
    const response = await this.api.post('/autenticacao/verificar', data)
    return response.data
  }

  async alterarSenha(data: AlterarSenha): Promise<{ success: boolean; message: string }> {
    const response = await this.api.post('/autenticacao/alterar-senha', data)
    return response.data
  }

  async solicitarResetSenha(data: SolicitarReset): Promise<RespostaReset> {
    const response = await this.api.post('/autenticacao/solicitar-reset-senha', data)
    return response.data
  }

  async resetSenha(data: ResetSenha): Promise<{ success: boolean; message: string }> {
    const response = await this.api.post('/autenticacao/reset-senha', data)
    return response.data
  }

  // User management endpoints
  async listarUtilizadores(): Promise<Utilizador[]> {
    const response = await this.api.get('/utilizadores')
    return response.data
  }

  async registarUtilizador(data: RegistarUtilizador): Promise<Utilizador> {
    const response = await this.api.post('/utilizadores', data)
    return response.data
  }

  async obterUtilizador(utilizadorId: number): Promise<Utilizador> {
    const response = await this.api.get(`/utilizadores/${utilizadorId}`)
    return response.data
  }

  async atualizarUtilizador(utilizadorId: number, data: AtualizarUtilizador): Promise<Utilizador> {
    const response = await this.api.put(`/utilizadores/${utilizadorId}`, data)
    return response.data
  }

  async eliminarUtilizador(utilizadorId: number): Promise<{ success: boolean; message: string }> {
    const response = await this.api.delete(`/utilizadores/${utilizadorId}`)
    return response.data
  }

  async logout(): Promise<void> {
    try {
      // Note: Swagger doesn't define a logout endpoint, so we just clear local data
      console.log('Logging out user')
    } catch (error) {
      console.warn('Logout process failed:', error)
    } finally {
      this.removeAuthToken()
    }
  }

  // Assessment endpoints - Based on Swagger API
  async getAvaliacoes(filters?: AvaliacaoFilters): Promise<AvaliacaoDesastre[]> {
    try {
      const response = await this.api.get('/avaliacoes', { params: filters })
      return response.data
    } catch (error) {
      console.warn('API call failed, using mock data:', error)
      return mockAvaliacoes
    }
  }

  async getAvaliacao(id: number): Promise<AvaliacaoDesastre> {
    const response = await this.api.get(`/avaliacoes/${id}`)
    return response.data
  }

  async createAvaliacao(data: EntradaAvaliacao): Promise<AvaliacaoDesastre> {
    const response = await this.api.post('/avaliacoes', data)
    return response.data
  }

  async updateAvaliacao(id: number, data: EntradaAvaliacao): Promise<AvaliacaoDesastre> {
    const response = await this.api.put(`/avaliacoes/${id}`, data)
    return response.data
  }

  async deleteAvaliacao(id: number): Promise<void> {
    await this.api.delete(`/avaliacoes/${id}`)
  }

  async getOpcoes(): Promise<Opcoes> {
    try {
      const response = await this.api.get('/avaliacoes/options')
      return response.data
    } catch (error) {
      console.warn('API call failed, using mock options:', error)
      return mockOpcoes
    }
  }

  // Legacy methods for compatibility
  async getAssessments(params?: {
    page?: number
    per_page?: number
    status?: string
    disaster_type?: string
    severity?: string
  }): Promise<Assessment[]> {
    const avaliacoes = await this.getAvaliacoes(params)
    return avaliacoes.map(this.mapAvaliacaoToAssessment.bind(this))
  }

  async getAssessment(id: string): Promise<Assessment> {
    const avaliacao = await this.getAvaliacao(parseInt(id))
    return this.mapAvaliacaoToAssessment(avaliacao)
  }

  async createAssessment(data: CreateAssessmentRequest): Promise<Assessment> {
    const avaliacao = await this.createAvaliacao(data)
    return this.mapAvaliacaoToAssessment(avaliacao)
  }

  async updateAssessment(id: string, data: UpdateAssessmentRequest): Promise<Assessment> {
    const updateData: EntradaAvaliacao = {
      nome_responsavel: data.nome_responsavel || '',
      numero_documento: data.numero_documento || '',
      contacto_telefonico: data.contacto_telefonico || '',
      membros_agregado: data.membros_agregado || 0,
      grupos_vulneraveis: data.grupos_vulneraveis || [],
      endereco_completo: data.endereco_completo || '',
      ponto_referencia: data.ponto_referencia || '',
      latitude_gps: data.latitude_gps || 0,
      longitude_gps: data.longitude_gps || 0,
      tipo_estrutura: data.tipo_estrutura || 'habitacao',
      nivel_danos: data.nivel_danos || 'parcial',
      perdas: data.perdas || [],
      outras_perdas: data.outras_perdas || '',
      necessidade_urgente: data.necessidade_urgente || 'agua_potavel',
      outra_necessidade: data.outra_necessidade || ''
    }
    const avaliacao = await this.updateAvaliacao(parseInt(id), updateData)
    return this.mapAvaliacaoToAssessment(avaliacao)
  }

  async deleteAssessment(id: string): Promise<void> {
    await this.deleteAvaliacao(parseInt(id))
  }

  // Evidence endpoints - Based on Swagger API
  async getAssessmentEvidence(assessmentId: string): Promise<Evidence[]> {
    const response: AxiosResponse<ApiResponse<Evidence[]>> = await this.api.get(`/avaliacoes/${assessmentId}/evidence`)
    return response.data.data
  }

  async uploadEvidence(assessmentId: string, data: UploadEvidenceRequest): Promise<Evidence> {
    const formData = new FormData()
    formData.append('file', data.file)
    if (data.description) {
      formData.append('description', data.description)
    }

    const response: AxiosResponse<ApiResponse<Evidence>> = await this.api.post(
      `/avaliacoes/${assessmentId}/evidence`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    )
    return response.data.data
  }

  async deleteEvidence(assessmentId: string, evidenceId: string): Promise<void> {
    await this.api.delete(`/avaliacoes/${assessmentId}/evidence/${evidenceId}`)
  }

  // Statistics endpoints - Based on Swagger API
  async getEstatisticas(): Promise<Estatisticas> {
    try {
      const response = await this.api.get('/avaliacoes/statistics')
      return response.data
    } catch (error) {
      console.warn('API call failed, using mock statistics:', error)
      return mockEstatisticas
    }
  }

  // Legacy statistics method
  async getStatistics(): Promise<AssessmentStatistics> {
    const estatisticas = await this.getEstatisticas()
    return {
      ...estatisticas,
      pending_assessments: 0,
      in_progress_assessments: 0,
      completed_assessments: estatisticas.total_avaliacoes,
      cancelled_assessments: 0,
      assessments_by_type: estatisticas.estatisticas_tipo_estrutura,
      assessments_by_severity: estatisticas.estatisticas_nivel_danos,
      total_estimated_damage: 0,
      total_affected_people: 0,
    }
  }

  // Helper method to map API data to legacy format
  private mapAvaliacaoToAssessment(avaliacao: AvaliacaoDesastre): Assessment {
    return {
      id: avaliacao.id,
      title: `Avaliação - ${avaliacao.nome_responsavel}`,
      description: `Estrutura: ${avaliacao.tipo_estrutura}, Danos: ${avaliacao.nivel_danos}`,
      location: {
        latitude: avaliacao.latitude_gps || 0,
        longitude: avaliacao.longitude_gps || 0,
        address: avaliacao.endereco_completo
      },
      disaster_type: avaliacao.tipo_estrutura,
       severity: avaliacao.nivel_danos,
       status: 'completed',
       assigned_to: null,
       created_by: 'system',
       completed_at: avaliacao.data_criacao,
       estimated_damage: null,
       affected_people: avaliacao.membros_agregado,
       notes: avaliacao.outras_perdas || null,
       nome_responsavel: avaliacao.nome_responsavel,
       contacto_telefonico: avaliacao.contacto_telefonico,
       numero_documento: avaliacao.numero_documento,
       membros_agregado: avaliacao.membros_agregado,
       grupos_vulneraveis: avaliacao.grupos_vulneraveis,
       endereco_completo: avaliacao.endereco_completo,
       ponto_referencia: avaliacao.ponto_referencia,
       latitude_gps: avaliacao.latitude_gps,
       longitude_gps: avaliacao.longitude_gps,
       tipo_estrutura: avaliacao.tipo_estrutura,
       nivel_danos: avaliacao.nivel_danos,
       perdas: avaliacao.perdas,
       outras_perdas: avaliacao.outras_perdas,
       necessidade_urgente: avaliacao.necessidade_urgente,
       outra_necessidade: avaliacao.outra_necessidade,
       data_criacao: avaliacao.data_criacao,
       data_atualizacao: avaliacao.data_atualizacao
    }
  }

  // Utility methods
  setAuthToken(token: string | null): void {
    if (token) {
      localStorage.setItem('auth_token', token)
    } else {
      localStorage.removeItem('auth_token')
    }
  }

  removeAuthToken(): void {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user')
  }

  getAuthToken(): string | null {
    return localStorage.getItem('auth_token')
  }

  isAuthenticated(): boolean {
    return !!this.getAuthToken()
  }
}

export const apiService = new ApiService()
export default apiService
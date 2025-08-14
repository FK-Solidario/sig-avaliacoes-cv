import { create } from 'zustand'
import { AssessmentState, AvaliacaoFilters } from '@/types'
import { apiService } from '@/services/api'

interface ExtendedAssessmentState extends AssessmentState {
  filters: AvaliacaoFilters
  setFilters: (filters: AvaliacaoFilters) => void
  fetchAvaliacoes: (filters?: AvaliacaoFilters) => Promise<void>
}

export const useAssessmentStore = create<ExtendedAssessmentState>()((set, get) => ({
  assessments: [],
  currentAssessment: null,
  loading: false,
  error: null,
  filters: {},

  setFilters: (filters: AvaliacaoFilters) => {
    set({ filters })
  },

  fetchAvaliacoes: async (filters?: AvaliacaoFilters) => {
    set({ loading: true, error: null })
    try {
      const avaliacoes = await apiService.getAvaliacoes(filters || get().filters)
      const assessments = avaliacoes.map(avaliacao => ({
        ...avaliacao,
        id: avaliacao.id,
        title: `Avaliação - ${avaliacao.nome_responsavel}`,
        description: `Endereço: ${avaliacao.endereco_completo}`,
        location: {
          latitude: avaliacao.latitude_gps || 0,
          longitude: avaliacao.longitude_gps || 0,
          address: avaliacao.endereco_completo,
        },
        disaster_type: avaliacao.tipo_estrutura,
        severity: avaliacao.nivel_danos,
        status: 'completed',
        assigned_to: null,
        created_by: 'system',
        created_at: avaliacao.data_criacao,
        updated_at: avaliacao.data_atualizacao,
        completed_at: avaliacao.data_criacao,
        estimated_damage: null,
        affected_people: avaliacao.membros_agregado,
        notes: avaliacao.outras_perdas || null,
      }))
      set({ assessments, loading: false })
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch assessments',
        loading: false 
      })
    }
  },

  fetchAssessments: async () => {
    await get().fetchAvaliacoes()
  },

  fetchAssessment: async (id: string) => {
    set({ loading: true, error: null })
    try {
      const assessment = await apiService.getAssessment(id)
      set({ currentAssessment: assessment, loading: false })
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch assessment',
        loading: false 
      })
    }
  },

  createAssessment: async (data) => {
    set({ loading: true, error: null })
    try {
      const assessment = await apiService.createAssessment(data)
      const { assessments } = get()
      set({ 
        assessments: [...assessments, assessment],
        loading: false 
      })
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to create assessment',
        loading: false 
      })
    }
  },

  updateAssessment: async (id: string, data) => {
    set({ loading: true, error: null })
    try {
      const updatedAssessment = await apiService.updateAssessment(id, data)
      const { assessments } = get()
      set({ 
        assessments: assessments.map(a => Number(a.id) === Number(id) ? updatedAssessment : a),
        currentAssessment: updatedAssessment,
        loading: false 
      })
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update assessment',
        loading: false 
      })
    }
  },

  deleteAssessment: async (id: string) => {
    set({ loading: true, error: null })
    try {
      await apiService.deleteAssessment(id)
      const { assessments } = get()
      set({ 
        assessments: assessments.filter(a => Number(a.id) !== Number(id)),
        loading: false 
      })
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to delete assessment',
        loading: false 
      })
    }
  },

  setCurrentAssessment: (assessment) => {
    set({ currentAssessment: assessment })
  },
}))
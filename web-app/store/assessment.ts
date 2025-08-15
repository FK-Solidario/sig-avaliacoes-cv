import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Assessment, CreateAssessmentRequest, UpdateAssessmentData } from '@/types'
import { apiService } from '@/services/api'

interface AssessmentState {
  assessments: Assessment[]
  currentAssessment: Assessment | null
  loading: boolean
  error: string | null
  
  // Actions
  setAssessments: (assessments: Assessment[]) => void
  setCurrentAssessment: (assessment: Assessment | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  clearError: () => void
  
  // API Actions
  fetchAssessments: () => Promise<void>
  fetchAssessment: (id: string) => Promise<void>
  createAssessment: (data: CreateAssessmentRequest) => Promise<Assessment | null>
  updateAssessment: (id: string, data: UpdateAssessmentData) => Promise<Assessment | null>
  deleteAssessment: (id: string) => Promise<boolean>
}

export const useAssessmentStore = create<AssessmentState>()((
  persist(
    (set, get) => ({
      assessments: [],
      currentAssessment: null,
      loading: false,
      error: null,
      
      setAssessments: (assessments) => set({ assessments }),
      setCurrentAssessment: (assessment) => set({ currentAssessment: assessment }),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
      clearError: () => set({ error: null }),
      
      fetchAssessments: async () => {
        try {
          set({ loading: true, error: null })
          const assessments = await apiService.getAssessments()
          set({ assessments, loading: false })
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Erro ao carregar avaliações',
            loading: false 
          })
        }
      },
      
      fetchAssessment: async (id: string) => {
        try {
          set({ loading: true, error: null })
          const assessment = await apiService.getAssessment(id)
          set({ currentAssessment: assessment, loading: false })
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Erro ao carregar avaliação',
            loading: false 
          })
        }
      },
      
      createAssessment: async (data: CreateAssessmentRequest) => {
        try {
          set({ loading: true, error: null })
          const assessment = await apiService.createAssessment(data)
          const { assessments } = get()
          set({ 
            assessments: [...assessments, assessment],
            loading: false 
          })
          return assessment
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Erro ao criar avaliação',
            loading: false 
          })
          return null
        }
      },
      
      updateAssessment: async (id: string, data: UpdateAssessmentData) => {
        try {
          set({ loading: true, error: null })
          const updatedAssessment = await apiService.updateAssessment(id, data)
          const { assessments } = get()
          set({ 
            assessments: assessments.map(a => a.id.toString() === id ? updatedAssessment : a),
            currentAssessment: updatedAssessment,
            loading: false 
          })
          return updatedAssessment
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Erro ao atualizar avaliação',
            loading: false 
          })
          return null
        }
      },
      
      deleteAssessment: async (id: string) => {
        try {
          set({ loading: true, error: null })
          await apiService.deleteAssessment(id)
          const { assessments } = get()
          set({ 
            assessments: assessments.filter(a => a.id.toString() !== id),
            loading: false 
          })
          return true
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Erro ao deletar avaliação',
            loading: false 
          })
          return false
        }
      }
    }),
    {
      name: 'assessment-store',
      partialize: (state) => ({ 
        assessments: state.assessments,
        currentAssessment: state.currentAssessment 
      })
    }
  )
))
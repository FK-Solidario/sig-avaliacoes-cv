import { create } from 'zustand'
import { StatisticsState } from '@/types'
import { apiService } from '@/services/api'

export const useStatisticsStore = create<StatisticsState>()((set, get) => ({
  statistics: null,
  options: null,
  loading: false,
  error: null,

  fetchStatistics: async () => {
    set({ loading: true, error: null })
    try {
      const statistics = await apiService.getEstatisticas()
      set({ statistics, loading: false })
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch statistics',
        loading: false 
      })
    }
  },

  fetchOptions: async () => {
    set({ loading: true, error: null })
    try {
      const options = await apiService.getOpcoes()
      set({ options, loading: false })
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch options',
        loading: false 
      })
    }
  },
}))
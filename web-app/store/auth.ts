import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { AuthUser, AuthUtils } from '@/lib/auth-utils'
import axios from 'axios'

interface AuthStore {
  user: AuthUser | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  setUser: (user: AuthUser) => void
  clearError: () => void
  checkAuth: () => Promise<void>
  hasPermission: (permission: string) => boolean
  hasRole: (role: string) => boolean
}

export const useAuthStore = create<AuthStore>()((  persist(    (set, get) => ({      user: null,      token: null,      isAuthenticated: false,      isLoading: false,      error: null,
      login: async (email: string, password: string) => {
        try {
          set({ isLoading: true, error: null });
          
          const response = await axios.post('/api/auth/login', {
            email,
            password
          });
          
          if (response.data.success) {
            const { token, user } = response.data;
            
            // Salvar token e usuário
            AuthUtils.saveToken(token);
            AuthUtils.saveUser(user);
            
            set({ 
              user, 
              token, 
              isAuthenticated: true, 
              isLoading: false,
              error: null 
            });
          } else {
            throw new Error(response.data.message || 'Erro no login');
          }
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || error.message || 'Erro no login';
          set({ error: errorMessage, isLoading: false });
          throw new Error(errorMessage);
        }
      },
      logout: async () => {
        try {
          set({ isLoading: true });
          
          // Chamar endpoint de logout (opcional)
          try {
            await axios.delete('/api/auth/login');
          } catch (error) {
            console.warn('Logout endpoint failed:', error);
          }
          
          // Limpar dados locais
          AuthUtils.removeToken();
          
        } catch (error) {
          console.error('Logout failed:', error);
        } finally {
          set({ 
            user: null, 
            token: null, 
            isAuthenticated: false, 
            isLoading: false, 
            error: null 
          });
        }
      },
      setUser: (user: AuthUser) => {
        set({ user });
        AuthUtils.saveUser(user);
      },
      clearError: () => {
        set({ error: null });
      },
      
      checkAuth: async () => {
        const token = AuthUtils.getToken();
        const user = AuthUtils.getUser();
        
        if (!token || !user) {
          set({ user: null, token: null, isAuthenticated: false });
          return;
        }
        
        // Verificar se o token não expirou
        if (AuthUtils.isTokenExpired(token)) {
          AuthUtils.removeToken();
          set({ user: null, token: null, isAuthenticated: false });
          return;
        }
        
        // Verificar token com o servidor
        try {
          const response = await axios.get('/api/auth/verify', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          
          if (response.data.success && response.data.valid) {
            set({ 
              user: response.data.user, 
              token, 
              isAuthenticated: true 
            });
          } else {
            AuthUtils.removeToken();
            set({ user: null, token: null, isAuthenticated: false });
          }
        } catch (error) {
          console.error('Auth verification failed:', error);
          AuthUtils.removeToken();
          set({ user: null, token: null, isAuthenticated: false });
        }
      },
      
      hasPermission: (permission: string) => {
        const { user } = get();
        return AuthUtils.hasPermission(user, permission);
      },
      
      hasRole: (role: string) => {
        const { user } = get();
        return AuthUtils.hasRole(user, role);
      },    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        // Restore auth state on rehydration
        if (state?.token && state?.user) {
          // Token is already restored by persist middleware
          console.log('Auth state rehydrated successfully')
        }
      },
    }
  )
))

// Initialize auth state from localStorage on app start
if (typeof window !== 'undefined') {
  // Check auth state on app initialization
  useAuthStore.getState().checkAuth()
}
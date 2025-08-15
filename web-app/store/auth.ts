import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { AuthUser, AuthUtils } from '@/lib/auth-utils'
import { apiService } from '@/services/api'
import { Login, Token, Utilizador, AlterarSenha, SolicitarReset, ResetSenha } from '@/types'

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
  // New methods based on Swagger API
  alterarSenha: (senhaAtual: string, novaSenha: string) => Promise<void>
  solicitarResetSenha: (email: string) => Promise<void>
  resetSenha: (token: string, novaSenha: string) => Promise<void>
}

export const useAuthStore = create<AuthStore>()((  persist(    (set, get) => ({      user: null,      token: null,      isAuthenticated: false,      isLoading: false,      error: null,
      login: async (email: string, password: string) => {
        try {
          set({ isLoading: true, error: null });
          
          const credentials: Login = {
            email,
            senha: password
          };
          
          const tokenData: Token = await apiService.login(credentials);
          
          // Convert Utilizador to AuthUser for compatibility
          if (!tokenData.utilizador) {
            throw new Error('Dados do utilizador não encontrados na resposta');
          }
          
          const authUser: AuthUser = {
            id: tokenData.utilizador.id?.toString() || '',
            name: tokenData.utilizador.nome || '',
            email: tokenData.utilizador.email || email,
            role: tokenData.utilizador.papel || '',
            permissions: [] // Default empty permissions array
          };
          
          // Validate required fields
          if (!authUser.id || !authUser.name || !authUser.role) {
            throw new Error('Dados do utilizador incompletos');
          }
          
          // Save token and user
          AuthUtils.saveToken(tokenData.token);
          AuthUtils.saveUser(authUser);
          
          set({ 
            user: authUser, 
            token: tokenData.token, 
            isAuthenticated: true, 
            isLoading: false,
            error: null 
          });
        } catch (error: any) {
          const errorMessage = error.message || 'Erro no login';
          set({ error: errorMessage, isLoading: false });
          throw new Error(errorMessage);
        }
      },
      logout: async () => {
        try {
          set({ isLoading: true });
          
          // Call logout method from API service
          await apiService.logout();
          
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
        
        // Check if token is expired
        if (AuthUtils.isTokenExpired(token)) {
          AuthUtils.removeToken();
          set({ user: null, token: null, isAuthenticated: false });
          return;
        }
        
        // Verify token with server using new API
        try {
          const verificationData = { token };
          const response = await apiService.verificarToken(verificationData);
          
          if (response.valido && response.utilizador) {
            // Convert Utilizador to AuthUser for compatibility
            const authUser: AuthUser = {
              id: response.utilizador.id?.toString() || '',
              name: response.utilizador.nome || '',
              email: response.utilizador.email || '',
              role: response.utilizador.papel || '',
              permissions: [] // Default empty permissions array
            };
            
            // Validate required fields from server response
            if (!authUser.id || !authUser.name || !authUser.email || !authUser.role) {
              throw new Error('Dados do utilizador incompletos na verificação');
            }
            
            set({ 
              user: authUser, 
              token, 
              isAuthenticated: true 
            });
          } else {
            AuthUtils.removeToken();
            set({ user: null, token: null, isAuthenticated: false });
          }
        } catch (error) {
          console.error('Auth verification failed:', error);
          // Remove invalid token and logout user
          AuthUtils.removeToken();
          AuthUtils.removeUser();
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
      },
      
      // New methods based on Swagger API
      alterarSenha: async (senhaAtual: string, novaSenha: string) => {
        try {
          set({ isLoading: true, error: null });
          
          const data: AlterarSenha = {
            senha_atual: senhaAtual,
            senha_nova: novaSenha,
            confirmar_senha: novaSenha
          };
          
          const response = await apiService.alterarSenha(data);
          
          if (!response.success) {
            throw new Error(response.message || 'Erro ao alterar senha');
          }
          
          set({ isLoading: false });
        } catch (error: any) {
          const errorMessage = error.message || 'Erro ao alterar senha';
          set({ error: errorMessage, isLoading: false });
          throw new Error(errorMessage);
        }
      },
      
      solicitarResetSenha: async (email: string) => {
        try {
          set({ isLoading: true, error: null });
          
          const data: SolicitarReset = { email };
          const response = await apiService.solicitarResetSenha(data);
          
          if (!response.email_enviado) {
            throw new Error(response.mensagem || 'Erro ao solicitar reset de senha');
          };
          
          set({ isLoading: false });
        } catch (error: any) {
          const errorMessage = error.message || 'Erro ao solicitar reset de senha';
          set({ error: errorMessage, isLoading: false });
          throw new Error(errorMessage);
        }
      },
      
      resetSenha: async (token: string, novaSenha: string) => {
        try {
          set({ isLoading: true, error: null });
          
          const data: ResetSenha = {
            token,
            nova_senha: novaSenha
          };
          
          const response = await apiService.resetSenha(data);
          
          if (!response.success) {
            throw new Error(response.message || 'Erro ao redefinir senha');
          }
          
          set({ isLoading: false });
        } catch (error: any) {
          const errorMessage = error.message || 'Erro ao redefinir senha';
          set({ error: errorMessage, isLoading: false });
          throw new Error(errorMessage);
        }
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
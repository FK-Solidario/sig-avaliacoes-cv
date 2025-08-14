import { MockUser } from './mock-users';

// Tipos para autenticação
export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: string;
  permissions: string[];
  avatar?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
}

// Utilitários para trabalhar com tokens
export class AuthUtils {
  private static readonly TOKEN_KEY = 'auth-token';
  private static readonly USER_KEY = 'auth-user';

  // Salvar token no localStorage e cookie
  static saveToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.TOKEN_KEY, token);
      // Definir cookie para o middleware
      document.cookie = `auth-token=${token}; path=/; max-age=${24 * 60 * 60}; SameSite=Lax`;
    }
  }

  // Obter token do localStorage
  static getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(this.TOKEN_KEY);
    }
    return null;
  }

  // Remover token
  static removeToken(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem(this.USER_KEY);
      // Remover cookie
      document.cookie = 'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    }
  }

  // Salvar dados do usuário
  static saveUser(user: AuthUser): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    }
  }

  // Obter dados do usuário
  static getUser(): AuthUser | null {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem(this.USER_KEY);
      return userData ? JSON.parse(userData) : null;
    }
    return null;
  }

  // Verificar se o usuário está autenticado
  static isAuthenticated(): boolean {
    return this.getToken() !== null && this.getUser() !== null;
  }

  // Decodificar JWT mock
  static decodeToken(token: string): any {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        return null;
      }
      return JSON.parse(atob(parts[1]));
    } catch (error) {
      return null;
    }
  }

  // Verificar se o token expirou
  static isTokenExpired(token: string): boolean {
    const payload = this.decodeToken(token);
    if (!payload || !payload.exp) {
      return true;
    }
    const now = Math.floor(Date.now() / 1000);
    return payload.exp < now;
  }

  // Verificar permissão
  static hasPermission(user: AuthUser | null, permission: string): boolean {
    return user?.permissions.includes(permission) || false;
  }

  // Verificar múltiplas permissões (OR)
  static hasAnyPermission(user: AuthUser | null, permissions: string[]): boolean {
    if (!user) return false;
    return permissions.some(permission => user.permissions.includes(permission));
  }

  // Verificar múltiplas permissões (AND)
  static hasAllPermissions(user: AuthUser | null, permissions: string[]): boolean {
    if (!user) return false;
    return permissions.every(permission => user.permissions.includes(permission));
  }

  // Verificar role
  static hasRole(user: AuthUser | null, role: string): boolean {
    return user?.role === role;
  }

  // Verificar se é administrador
  static isAdmin(user: AuthUser | null): boolean {
    return this.hasRole(user, 'administrator');
  }

  // Verificar se é coordenador
  static isCoordinator(user: AuthUser | null): boolean {
    return this.hasRole(user, 'coordinator');
  }

  // Verificar se é analista
  static isAnalyst(user: AuthUser | null): boolean {
    return this.hasRole(user, 'analyst');
  }

  // Verificar se é equipa de terreno
  static isFieldTeam(user: AuthUser | null): boolean {
    return this.hasRole(user, 'field_team');
  }

  // Obter label da role
  static getRoleLabel(role: string): string {
    const labels: Record<string, string> = {
      administrator: 'Administrador',
      coordinator: 'Coordenador',
      analyst: 'Analista',
      field_team: 'Equipa de Terreno'
    };
    return labels[role] || role;
  }

  // Fazer logout
  static logout(): void {
    this.removeToken();
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  }

  // Redirecionar para login com URL de retorno
  static redirectToLogin(returnUrl?: string): void {
    if (typeof window !== 'undefined') {
      const loginUrl = returnUrl 
        ? `/login?redirect=${encodeURIComponent(returnUrl)}`
        : '/login';
      window.location.href = loginUrl;
    }
  }
}

// Hook personalizado para verificar permissões (para uso em componentes)
export function usePermissions() {
  return {
    hasPermission: AuthUtils.hasPermission,
    hasAnyPermission: AuthUtils.hasAnyPermission,
    hasAllPermissions: AuthUtils.hasAllPermissions,
    hasRole: AuthUtils.hasRole,
    isAdmin: AuthUtils.isAdmin,
    isCoordinator: AuthUtils.isCoordinator,
    isAnalyst: AuthUtils.isAnalyst,
    isFieldTeam: AuthUtils.isFieldTeam,
    getRoleLabel: AuthUtils.getRoleLabel
  };
}
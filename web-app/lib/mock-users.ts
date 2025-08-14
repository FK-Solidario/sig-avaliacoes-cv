export interface MockUser {
  id: string;
  email: string;
  password: string;
  name: string;
  role: 'administrator' | 'coordinator' | 'analyst' | 'field_team';
  permissions: string[];
  avatar?: string;
}

export const MOCK_USERS: MockUser[] = [
  {
    id: '1',
    email: 'admin@sistema.pt',
    password: 'admin123',
    name: 'João Silva',
    role: 'administrator',
    permissions: [
      'manage_users',
      'manage_settings',
      'view_dashboard',
      'manage_assessments',
      'view_reports',
      'manage_teams',
      'system_config'
    ],
    avatar: '/avatars/admin.jpg'
  },
  {
    id: '2',
    email: 'coordenador@emergencia.pt',
    password: 'coord123',
    name: 'Maria Santos',
    role: 'coordinator',
    permissions: [
      'view_dashboard',
      'manage_assessments',
      'view_reports',
      'manage_teams',
      'coordinate_operations'
    ],
    avatar: '/avatars/coordinator.jpg'
  },
  {
    id: '3',
    email: 'analista@dados.pt',
    password: 'analista123',
    name: 'Pedro Costa',
    role: 'analyst',
    permissions: [
      'view_dashboard',
      'view_reports',
      'create_reports',
      'analyze_data',
      'export_data'
    ],
    avatar: '/avatars/analyst.jpg'
  },
  {
    id: '4',
    email: 'terreno@campo.pt',
    password: 'terreno123',
    name: 'Ana Ferreira',
    role: 'field_team',
    permissions: [
      'create_assessments',
      'upload_evidence',
      'sync_offline',
      'view_assigned_tasks'
    ],
    avatar: '/avatars/field.jpg'
  }
];

export const ROLE_LABELS = {
  administrator: 'Administrador',
  coordinator: 'Coordenador',
  analyst: 'Analista',
  field_team: 'Equipa de Terreno'
} as const;

export const PERMISSION_LABELS = {
  manage_users: 'Gestão de Utilizadores',
  manage_settings: 'Gestão de Configurações',
  view_dashboard: 'Visualizar Dashboard',
  manage_assessments: 'Gestão de Avaliações',
  view_reports: 'Visualizar Relatórios',
  create_reports: 'Criar Relatórios',
  manage_teams: 'Gestão de Equipas',
  system_config: 'Configuração do Sistema',
  coordinate_operations: 'Coordenação de Operações',
  analyze_data: 'Análise de Dados',
  export_data: 'Exportar Dados',
  create_assessments: 'Criar Avaliações',
  upload_evidence: 'Upload de Evidências',
  sync_offline: 'Sincronização Offline',
  view_assigned_tasks: 'Ver Tarefas Atribuídas'
} as const;

export function findUserByCredentials(email: string, password: string): MockUser | null {
  return MOCK_USERS.find(user => user.email === email && user.password === password) || null;
}

export function getUserById(id: string): MockUser | null {
  return MOCK_USERS.find(user => user.id === id) || null;
}

export function hasPermission(user: MockUser, permission: string): boolean {
  return user.permissions.includes(permission);
}

export function getRolePermissions(role: MockUser['role']): string[] {
  const user = MOCK_USERS.find(u => u.role === role);
  return user ? user.permissions : [];
}

// Export for convenience in components
export const mockUsers = MOCK_USERS;
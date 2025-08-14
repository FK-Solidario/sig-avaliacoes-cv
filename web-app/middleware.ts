import { NextRequest, NextResponse } from 'next/server';
import { getUserById } from '@/lib/mock-users';

// Função para decodificar JWT mock
function decodeMockJWT(token: string) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }

    const payload = JSON.parse(atob(parts[1]));
    
    // Verificar se o token não expirou
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) {
      return null;
    }

    return payload;
  } catch (error) {
    return null;
  }
}

// Rotas que requerem autenticação
const protectedRoutes = [
  '/dashboard',
  '/avaliacoes',
  '/relatorios',
  '/utilizadores',
  '/configuracoes'
];

// Rotas públicas (não requerem autenticação)
const publicRoutes = [
  '/login',
  '/api/auth/login',
  '/api/auth/verify'
];

// Permissões por rota
const routePermissions: Record<string, string[]> = {
  '/dashboard': ['view_dashboard'],
  '/avaliacoes': ['view_dashboard', 'manage_assessments', 'create_assessments'],
  '/avaliacoes/novo': ['manage_assessments', 'create_assessments'],
  '/relatorios': ['view_reports', 'create_reports'],
  '/utilizadores': ['manage_users'],
  '/configuracoes': ['manage_settings', 'system_config']
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Permitir acesso a rotas públicas
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Permitir acesso a assets estáticos
  if (pathname.startsWith('/_next') || 
      pathname.startsWith('/favicon') || 
      pathname.startsWith('/images') ||
      pathname.startsWith('/icons')) {
    return NextResponse.next();
  }

  // Verificar se a rota requer autenticação
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  
  if (!isProtectedRoute) {
    return NextResponse.next();
  }

  // Verificar token de autenticação
  const token = request.cookies.get('auth-token')?.value || 
                request.headers.get('authorization')?.replace('Bearer ', '');

  if (!token) {
    // Redirecionar para login se não houver token
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Validar token
  const payload = decodeMockJWT(token);
  
  if (!payload) {
    // Token inválido, redirecionar para login
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    const response = NextResponse.redirect(loginUrl);
    response.cookies.delete('auth-token');
    return response;
  }

  // Verificar se o usuário existe
  const user = getUserById(payload.sub);
  
  if (!user) {
    const loginUrl = new URL('/login', request.url);
    const response = NextResponse.redirect(loginUrl);
    response.cookies.delete('auth-token');
    return response;
  }

  // Verificar permissões para a rota específica
  const requiredPermissions = routePermissions[pathname] || [];
  
  if (requiredPermissions.length > 0) {
    const hasPermission = requiredPermissions.some(permission => 
      user.permissions.includes(permission)
    );
    
    if (!hasPermission) {
      // Usuário não tem permissão, redirecionar para dashboard
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  // Adicionar informações do usuário aos headers para uso nas páginas
  const response = NextResponse.next();
  response.headers.set('x-user-id', user.id);
  response.headers.set('x-user-role', user.role);
  response.headers.set('x-user-permissions', JSON.stringify(user.permissions));
  
  return response;
}

// Configurar quais rotas o middleware deve processar
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server';

// Função para decodificar JWT real
function decodeJWT(token: string) {
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
  '/login'
];

// Controle de acesso baseado em papéis (roles)
// ADMIN: acesso total
// ANALISTA: dashboard, avaliacoes, relatorios
// COORDENADOR/TRABALHADOR_TERRENO: dashboard, avaliacoes

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
  
  console.log('Middleware Debug - Token found:', !!token);
  console.log('Middleware Debug - Cookie token:', !!request.cookies.get('auth-token')?.value);
  console.log('Middleware Debug - Header token:', !!request.headers.get('authorization'));

  if (!token) {
    // Redirecionar para login se não houver token
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Validar token JWT real
  const payload = decodeJWT(token);
  
  if (!payload) {
    // Token inválido, redirecionar para login
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    const response = NextResponse.redirect(loginUrl);
    response.cookies.delete('auth-token');
    return response;
  }

  // Extrair informações do usuário do payload JWT
  const userId = payload.sub || payload.user_id || payload.utilizador_id;
  // A API Swagger retorna 'papel' em vez de 'role'
  const userRole = payload.papel || payload.role;
  const userPermissions = payload.permissions || [];
  
  // Debug logs para diagnóstico
  console.log('Middleware Debug - JWT Payload:', { userId, userRole, payload });
  console.log('Middleware Debug - Token valid:', !!payload);
  console.log('Middleware Debug - User data extracted:', { userId: !!userId, userRole: !!userRole });
  
  if (!userId || !userRole) {
    // Payload JWT inválido, redirecionar para login
    const loginUrl = new URL('/login', request.url);
    const response = NextResponse.redirect(loginUrl);
    response.cookies.delete('auth-token');
    return response;
  }

  // Verificar acesso baseado no papel do usuário (sem exigir permissões específicas)
  // ADMIN tem acesso a tudo
  // ANALISTA pode acessar /avaliacoes e /relatorios
  // COORDENADOR e TRABALHADOR_TERRENO podem acessar /avaliacoes
  if (userRole !== 'ADMIN') {
    if (pathname.startsWith('/utilizadores') || pathname.startsWith('/configuracoes')) {
      // Apenas ADMIN pode acessar estas rotas
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    
    if (pathname.startsWith('/relatorios') && userRole !== 'ANALISTA') {
      // Apenas ADMIN e ANALISTA podem acessar relatórios
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  // Adicionar informações do usuário aos headers para uso nas páginas
  const response = NextResponse.next();
  response.headers.set('x-user-id', userId.toString());
  response.headers.set('x-user-role', userRole);
  response.headers.set('x-user-permissions', JSON.stringify(userPermissions));
  
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
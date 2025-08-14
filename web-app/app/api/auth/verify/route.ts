import { NextRequest, NextResponse } from 'next/server';
import { getUserById } from '@/lib/mock-users';

interface VerifyResponse {
  success: boolean;
  user?: {
    id: string;
    email: string;
    name: string;
    role: string;
    permissions: string[];
    avatar?: string;
  };
  message?: string;
  valid?: boolean;
}

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

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        {
          success: false,
          valid: false,
          message: 'Token de autorização não fornecido'
        } as VerifyResponse,
        { status: 401 }
      );
    }

    const token = authHeader.substring(7); // Remove 'Bearer '
    const payload = decodeMockJWT(token);

    if (!payload) {
      return NextResponse.json(
        {
          success: false,
          valid: false,
          message: 'Token inválido ou expirado'
        } as VerifyResponse,
        { status: 401 }
      );
    }

    // Buscar dados atualizados do usuário
    const user = getUserById(payload.sub);
    
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          valid: false,
          message: 'Usuário não encontrado'
        } as VerifyResponse,
        { status: 404 }
      );
    }

    // Resposta de sucesso
    const response: VerifyResponse = {
      success: true,
      valid: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        permissions: user.permissions,
        avatar: user.avatar
      },
      message: 'Token válido'
    };

    return NextResponse.json(response, { status: 200 });

  } catch (error) {
    console.error('Erro na verificação do token:', error);
    return NextResponse.json(
      {
        success: false,
        valid: false,
        message: 'Erro interno do servidor'
      } as VerifyResponse,
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  // Mesmo comportamento do GET, mas aceita token no body
  try {
    const body = await request.json();
    const token = body.token;
    
    if (!token) {
      return NextResponse.json(
        {
          success: false,
          valid: false,
          message: 'Token não fornecido'
        } as VerifyResponse,
        { status: 400 }
      );
    }

    const payload = decodeMockJWT(token);

    if (!payload) {
      return NextResponse.json(
        {
          success: false,
          valid: false,
          message: 'Token inválido ou expirado'
        } as VerifyResponse,
        { status: 401 }
      );
    }

    const user = getUserById(payload.sub);
    
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          valid: false,
          message: 'Usuário não encontrado'
        } as VerifyResponse,
        { status: 404 }
      );
    }

    const response: VerifyResponse = {
      success: true,
      valid: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        permissions: user.permissions,
        avatar: user.avatar
      },
      message: 'Token válido'
    };

    return NextResponse.json(response, { status: 200 });

  } catch (error) {
    console.error('Erro na verificação do token:', error);
    return NextResponse.json(
      {
        success: false,
        valid: false,
        message: 'Erro interno do servidor'
      } as VerifyResponse,
      { status: 500 }
    );
  }
}
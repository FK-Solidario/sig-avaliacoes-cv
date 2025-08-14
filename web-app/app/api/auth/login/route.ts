import { NextRequest, NextResponse } from 'next/server';
import { findUserByCredentials, MockUser } from '@/lib/mock-users';

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  success: boolean;
  token?: string;
  user?: {
    id: string;
    email: string;
    name: string;
    role: string;
    permissions: string[];
    avatar?: string;
  };
  message?: string;
  expiresIn?: number;
}

// Função para gerar JWT mock (simulado)
function generateMockJWT(user: MockUser): string {
  const header = {
    alg: 'HS256',
    typ: 'JWT'
  };

  const payload = {
    sub: user.id,
    email: user.email,
    role: user.role,
    permissions: user.permissions,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 horas
  };

  // Simulação de JWT (não é um JWT real, apenas para mock)
  const encodedHeader = btoa(JSON.stringify(header));
  const encodedPayload = btoa(JSON.stringify(payload));
  const signature = btoa(`mock-signature-${user.id}-${Date.now()}`);

  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

export async function POST(request: NextRequest) {
  try {
    const body: LoginRequest = await request.json();
    
    // Validação básica
    if (!body.email || !body.password) {
      return NextResponse.json(
        {
          success: false,
          message: 'Email e password são obrigatórios'
        } as LoginResponse,
        { status: 400 }
      );
    }

    // Simular delay de rede (opcional)
    await new Promise(resolve => setTimeout(resolve, 500));

    // Buscar usuário pelas credenciais
    const user = findUserByCredentials(body.email, body.password);

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: 'Credenciais inválidas'
        } as LoginResponse,
        { status: 401 }
      );
    }

    // Gerar token mock
    const token = generateMockJWT(user);
    const expiresIn = 24 * 60 * 60; // 24 horas em segundos

    // Resposta de sucesso
    const response: LoginResponse = {
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        permissions: user.permissions,
        avatar: user.avatar
      },
      message: 'Login realizado com sucesso',
      expiresIn
    };

    return NextResponse.json(response, { status: 200 });

  } catch (error) {
    console.error('Erro no login:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Erro interno do servidor'
      } as LoginResponse,
      { status: 500 }
    );
  }
}

// Endpoint para logout (opcional)
export async function DELETE() {
  return NextResponse.json(
    {
      success: true,
      message: 'Logout realizado com sucesso'
    },
    { status: 200 }
  );
}
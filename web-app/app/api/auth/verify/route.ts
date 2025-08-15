import { NextRequest, NextResponse } from 'next/server';

// Este endpoint foi removido pois agora usamos apenas a API real do Swagger
// Todas as chamadas de autenticação devem ser feitas através do services/api.ts
// que se conecta diretamente com a API em http://84.247.171.243:5000

export async function GET(request: NextRequest) {
  return NextResponse.json(
    {
      success: false,
      valid: false,
      message: 'Este endpoint foi desativado. Use a API real através do services/api.ts'
    },
    { status: 410 } // Gone
  );
}

export async function POST(request: NextRequest) {
  return NextResponse.json(
    {
      success: false,
      valid: false,
      message: 'Este endpoint foi desativado. Use a API real através do services/api.ts'
    },
    { status: 410 } // Gone
  );
}
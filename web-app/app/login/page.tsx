'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Eye, EyeOff } from 'lucide-react'
import { useAuthStore } from '@/store/auth'


const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Password é obrigatório')
})

type LoginForm = z.infer<typeof loginSchema>

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams?.get('redirect')
  const { login, isLoading, error, isAuthenticated, clearError } = useAuthStore()
  const [showPassword, setShowPassword] = useState(false)


  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  // Redirecionar se já autenticado baseado no papel
  useEffect(() => {
    if (isAuthenticated) {
      if (redirect) {
        router.replace(redirect)
      } else {
        redirectBasedOnRole()
      }
    }
  }, [isAuthenticated, router, redirect])

  // Limpar erro quando componente monta
  useEffect(() => {
    clearError()
  }, [])

  // Função para redirecionar baseado no papel do usuário
  const redirectBasedOnRole = () => {
    const { user } = useAuthStore.getState()
    if (!user) return

    switch (user.role) {
      case 'ADMIN':
        router.push('/')
        break
      case 'ANALISTA':
        router.push('/avaliacoes')
        break
      case 'COORDENADOR':
      case 'TRABALHADOR_TERRENO':
      default:
        router.push('/avaliacoes/novo')
        break
    }
  }

  const onSubmit = async (data: LoginForm) => {
    try {
      await login(data.email, data.password)
      if (redirect) {
        router.replace(redirect)
      } else {
        redirectBasedOnRole()
      }
    } catch (error) {
      // Erro já é tratado no store
      console.error('Login failed:', error)
    }
  }



  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Sistema de Gestão</h1>
          <p className="text-gray-600 mt-2">Avaliações de Desastres</p>
        </div>

        {/* Login Form */}
        <Card>
          <CardHeader>
            <CardTitle>Iniciar Sessão</CardTitle>
            <CardDescription>
              Insira as suas credenciais para aceder ao sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                {/* Email Field */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="seu@email.com"
                          {...field}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Password Field */}
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="••••••••"
                            {...field}
                            disabled={isLoading}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowPassword(!showPassword)}
                            disabled={isLoading}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Error Alert */}
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {/* Submit Button */}
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      A iniciar sessão...
                    </>
                  ) : (
                    'Iniciar Sessão'
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>



        {/* Footer */}
        <div className="text-center text-sm text-gray-500">
          <p>Sistema de Gestão de Avaliações de Desastres</p>
          <p className="mt-1">Versão 1.0 - Ambiente de Desenvolvimento</p>
        </div>
      </div>
    </div>
  )
}
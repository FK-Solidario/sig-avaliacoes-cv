import type { Metadata } from 'next'
import './globals.css'
import 'leaflet/dist/leaflet.css'
import { Inter } from 'next/font/google'
import { Toaster } from 'sonner'
import { MainLayout } from '@/components/layout/main-layout'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'FK - Sinistros CV',
  description: 'Gestão de sinistros em Cabo Verde',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt">
      <body className={inter.className}>
        <MainLayout>
          {children}
          <Toaster />
        </MainLayout>
      </body>
    </html>
  )
}
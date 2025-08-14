# Guia de Implementação e Deployment - Sistema de Gestão de Avaliações de Desastres

## 1. Estrutura de Projetos

### 1.1 Aplicação Web (web-app/)

```
web-app/
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.tsx                    # Dashboard principal
│   ├── loading.tsx
│   ├── error.tsx
│   ├── not-found.tsx
│   ├── avaliacoes/
│   │   ├── page.tsx                # Lista de avaliações
│   │   ├── loading.tsx
│   │   ├── [id]/
│   │   │   ├── page.tsx            # Detalhes da avaliação
│   │   │   ├── editar/
│   │   │   │   └── page.tsx        # Edição
│   │   │   └── loading.tsx
│   │   └── novo/
│   │       └── page.tsx            # Nova avaliação
│   ├── relatorios/
│   │   └── page.tsx                # Análise e relatórios
│   ├── configuracoes/
│   │   └── page.tsx                # Configurações
│   └── login/
│       └── page.tsx                # Autenticação
├── components/
│   ├── ui/                         # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── table.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── select.tsx
│   │   ├── form.tsx
│   │   └── ...
│   ├── layout/
│   │   ├── header.tsx
│   │   ├── sidebar.tsx
│   │   ├── breadcrumbs.tsx
│   │   └── navigation.tsx
│   ├── dashboard/
│   │   ├── stats-cards.tsx
│   │   ├── charts-section.tsx
│   │   └── map-component.tsx
│   ├── avaliacoes/
│   │   ├── avaliacoes-table.tsx
│   │   ├── avaliacoes-filters.tsx
│   │   ├── avaliacao-form.tsx
│   │   ├── avaliacao-details.tsx
│   │   └── evidence-gallery.tsx
│   └── common/
│       ├── loading-spinner.tsx
│       ├── error-boundary.tsx
│       └── confirmation-dialog.tsx
├── hooks/
│   ├── use-avaliacoes.ts
│   ├── use-auth.ts
│   ├── use-local-storage.ts
│   ├── use-debounce.ts
│   └── use-geolocation.ts
├── lib/
│   ├── utils.ts
│   ├── validations.ts
│   ├── constants.ts
│   ├── auth.ts
│   └── date-utils.ts
├── services/
│   ├── api.ts                      # Configuração Axios
│   ├── auth-service.ts
│   ├── avaliacoes-service.ts
│   ├── evidence-service.ts
│   └── statistics-service.ts
├── store/
│   ├── auth-store.ts               # Zustand store
│   ├── avaliacoes-store.ts
│   └── ui-store.ts
├── types/
│   ├── api.ts
│   ├── auth.ts
│   ├── avaliacoes.ts
│   └── common.ts
├── styles/
│   └── globals.css
├── public/
│   ├── icons/
│   ├── images/
│   └── favicon.ico
├── .env.local
├── .env.example
├── next.config.js
├── tailwind.config.js
├── components.json                 # shadcn/ui config
├── package.json
├── tsconfig.json
├── Dockerfile
└── docker-compose.yml
```

### 1.2 Aplicação Mobile (mobile-app/)

```
mobile-app/
├── src/
│   ├── screens/
│   │   ├── HomeScreen.tsx
│   │   ├── LoginScreen.tsx
│   │   ├── AvaliacaoFormScreen.tsx
│   │   ├── AvaliacaoDetalheScreen.tsx
│   │   ├── CameraScreen.tsx
│   │   ├── SyncScreen.tsx
│   │   └── ConfigScreen.tsx
│   ├── components/
│   │   ├── common/
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── LoadingSpinner.tsx
│   │   │   └── ErrorMessage.tsx
│   │   ├── forms/
│   │   │   ├── AvaliacaoForm.tsx
│   │   │   ├── LocationPicker.tsx
│   │   │   └── EvidenceUpload.tsx
│   │   ├── lists/
│   │   │   ├── AvaliacoesList.tsx
│   │   │   ├── AvaliacaoItem.tsx
│   │   │   └── SyncIndicator.tsx
│   │   └── navigation/
│   │       ├── TabNavigator.tsx
│   │       └── StackNavigator.tsx
│   ├── services/
│   │   ├── api.ts
│   │   ├── auth-service.ts
│   │   ├── avaliacoes-service.ts
│   │   ├── sync-service.ts
│   │   └── location-service.ts
│   ├── store/
│   │   ├── auth-store.ts
│   │   ├── avaliacoes-store.ts
│   │   ├── sync-store.ts
│   │   └── app-store.ts
│   ├── db/
│   │   ├── database.ts
│   │   ├── migrations/
│   │   │   ├── 001-initial.ts
│   │   │   ├── 002-add-sync-fields.ts
│   │   │   └── 003-add-evidence-table.ts
│   │   ├── models/
│   │   │   ├── Avaliacao.ts
│   │   │   ├── Evidence.ts
│   │   │   └── SyncQueue.ts
│   │   └── repositories/
│   │       ├── AvaliacaoRepository.ts
│   │       ├── EvidenceRepository.ts
│   │       └── SyncRepository.ts
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useAvaliacoes.ts
│   │   ├── useLocation.ts
│   │   ├── useCamera.ts
│   │   └── useSync.ts
│   ├── utils/
│   │   ├── constants.ts
│   │   ├── validations.ts
│   │   ├── date-utils.ts
│   │   ├── file-utils.ts
│   │   └── network-utils.ts
│   └── types/
│       ├── api.ts
│       ├── navigation.ts
│       ├── database.ts
│       └── common.ts
├── assets/
│   ├── icons/
│   ├── images/
│   └── fonts/
├── android/
├── ios/
├── .env
├── .env.example
├── package.json
├── tsconfig.json
├── metro.config.js
├── babel.config.js
├── react-native.config.js
└── app.json
```

## 2. Configuração e Instalação

### 2.1 Aplicação Web

**Pré-requisitos:**

* Node.js 18+

* npm ou yarn

* Git

**Instalação:**

```bash
# Clonar repositório
git clone <repository-url>
cd web-app

# Instalar dependências
npm install

# Configurar shadcn/ui
npx shadcn-ui@latest init
npx shadcn-ui@latest add button input table card dialog select form

# Configurar variáveis de ambiente
cp .env.example .env.local
```

**Variáveis de Ambiente (.env.local):**

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://84.247.171.243:5000/api
NEXT_PUBLIC_API_TIMEOUT=30000

# Authentication
NEXT_PUBLIC_JWT_SECRET=your-jwt-secret-key
NEXT_PUBLIC_TOKEN_EXPIRY=3600

# Maps Configuration
NEXT_PUBLIC_MAPBOX_TOKEN=your-mapbox-token
NEXT_PUBLIC_DEFAULT_LAT=39.5
NEXT_PUBLIC_DEFAULT_LNG=-8.0
NEXT_PUBLIC_DEFAULT_ZOOM=7

# File Upload
NEXT_PUBLIC_MAX_FILE_SIZE=10485760
NEXT_PUBLIC_ALLOWED_FILE_TYPES=image/jpeg,image/png,application/pdf

# Environment
NODE_ENV=development
NEXT_PUBLIC_APP_ENV=development
```

**Scripts de Desenvolvimento:**

```bash
# Desenvolvimento
npm run dev

# Build de produção
npm run build

# Iniciar produção
npm start

# Linting
npm run lint

# Testes
npm run test
```

### 2.2 Aplicação Mobile

**Pré-requisitos:**

* Node.js 18+

* React Native CLI

* Android Studio (para Android)

* Xcode (para iOS, apenas macOS)

**Instalação:**

```bash
# Clonar repositório
git clone <repository-url>
cd mobile-app

# Instalar dependências
npm install

# iOS (apenas macOS)
cd ios && pod install && cd ..

# Configurar variáveis de ambiente
cp .env.example .env
```

**Variáveis de Ambiente (.env):**

```env
# API Configuration
API_URL=http://84.247.171.243:5000/api
API_TIMEOUT=30000

# Database
DB_NAME=avaliacoes_desastres.db
DB_VERSION=1

# Sync Configuration
SYNC_INTERVAL=300000
MAX_RETRY_ATTEMPTS=3
OFFLINE_STORAGE_LIMIT=100

# Location
LOCATION_ACCURACY=high
LOCATION_TIMEOUT=15000

# File Upload
MAX_FILE_SIZE=5242880
IMAGE_QUALITY=0.8
IMAGE_MAX_WIDTH=1920
IMAGE_MAX_HEIGHT=1080
```

**Scripts de Desenvolvimento:**

```bash
# Android
npm run android

# iOS
npm run ios

# Metro bundler
npm start

# Build Android
npm run build:android

# Build iOS
npm run build:ios
```

## 3. Configuração Docker

### 3.1 Dockerfile - Aplicação Web

```dockerfile
# web-app/Dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && pnpm i --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Environment variables for build
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_MAPBOX_TOKEN
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_MAPBOX_TOKEN=$NEXT_PUBLIC_MAPBOX_TOKEN

RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

### 3.2 Docker Compose

```yaml
# docker-compose.yml
version: '3.8'

services:
  web-app:
    build:
      context: ./web-app
      dockerfile: Dockerfile
      args:
        NEXT_PUBLIC_API_URL: http://84.247.171.243:5000/api
        NEXT_PUBLIC_MAPBOX_TOKEN: ${MAPBOX_TOKEN}
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    restart: unless-stopped
    networks:
      - app-network

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf
      - ./nginx/ssl:/etc/nginx/ssl
    depends_on:
      - web-app
    restart: unless-stopped
    networks:
      - app-network

networks:
  app-network:
    driver: bridge

volumes:
  nginx-ssl:
```

### 3.3 Configuração Nginx

```nginx
# nginx/nginx.conf
events {
    worker_connections 1024;
}

http {
    upstream web-app {
        server web-app:3000;
    }

    # Redirect HTTP to HTTPS
    server {
        listen 80;
        server_name your-domain.com;
        return 301 https://$server_name$request_uri;
    }

    # HTTPS Server
    server {
        listen 443 ssl http2;
        server
```


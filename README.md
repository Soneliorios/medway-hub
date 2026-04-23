# Medway Hub

Plataforma centralizada de projetos Medway — catálogo estilo Netflix com autenticação única (SSO via token JWT).

## Stack

- **Next.js 14** (App Router)
- **Tailwind CSS** + design system Medway dark
- **NextAuth.js** (JWT, Credentials)
- **Prisma 7** + **SQLite** (via `better-sqlite3`)
- **Fonte:** Montserrat (Google Fonts)

## Início Rápido

### 1. Clone e instale

```bash
git clone <repo>
cd medway-hub
npm install
```

### 2. Configure as variáveis de ambiente

```bash
cp .env.example .env
```

Edite `.env` e gere os secrets:

```bash
# Gerar NEXTAUTH_SECRET
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Gerar SSO_SECRET
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### 3. Inicialize o banco de dados

```bash
npm run db:push   # Cria as tabelas
npm run db:seed   # Cria admin + 5 projetos de exemplo
```

### 4. Rode o servidor de desenvolvimento

```bash
npm run dev
```

Acesse `http://localhost:3000` e faça login com:
- **E-mail:** `admin@medway.com.br`
- **Senha:** `Admin@123456` (ou o valor de `SEED_ADMIN_PASSWORD` no `.env`)

---

## Scripts disponíveis

| Comando | Descrição |
|---|---|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de produção |
| `npm start` | Servidor de produção |
| `npm run db:push` | Sincroniza schema → banco |
| `npm run db:seed` | Seed: admin + projetos de exemplo |
| `npm run db:studio` | Prisma Studio (GUI do banco) |

---

## Deploy no Vercel

### SQLite no Vercel

SQLite é um arquivo local — o filesystem do Vercel é **efêmero** (dados são perdidos a cada deploy). Para produção, migre para **Turso** (SQLite-compatible, mantém persistência):

1. Crie uma conta em turso.tech
2. Crie um banco: `turso db create medway-hub`
3. Obtenha as credenciais:
   ```bash
   turso db show medway-hub --url
   turso db tokens create medway-hub
   ```
4. Atualize `.env`:
   ```env
   DATABASE_URL="libsql://your-db.turso.io"
   TURSO_AUTH_TOKEN="your-token"
   ```
5. Instale o adapter:
   ```bash
   npm install @libsql/client @prisma/adapter-libsql
   ```
6. Atualize `src/lib/prisma.ts` para usar `PrismaLibSQL` em vez de `PrismaBetterSqlite3`

Para **desenvolvimento local** com SQLite simples, `file:./prisma/dev.db` funciona perfeitamente.

### Variáveis no Vercel

Configure em **Settings → Environment Variables**:

```
DATABASE_URL
NEXTAUTH_URL     → https://seu-hub.vercel.app
NEXTAUTH_SECRET
SSO_SECRET
```

---

## Arquitetura SSO

O Hub usa tokens JWT de curta duração (15 minutos) para dar acesso autenticado a projetos externos embedados em iframes.

### Fluxo completo

```
1. Usuário clica "Abrir Projeto" no catálogo
2. Frontend chama POST /api/sso { projectId }
3. Hub verifica sessão NextAuth → assina JWT de 15min
4. EmbedModal monta URL: embedUrl + ?hub_token=TOKEN
5. <iframe> carrega a URL do projeto externo
6. Projeto externo lê ?hub_token= da URL
7. Projeto externo chama POST hub.medway.com.br/api/sso/verify { token }
8. Hub verifica assinatura + expiração → retorna payload do usuário
9. Projeto externo renderiza conteúdo para o usuário autenticado
```

### Adaptar projetos externos

Três opções disponíveis em `exports/`:

#### Opção A: Validação via API (HTML puro)

```html
<script>
  window.HUB_BASE_URL = "https://hub.medway.com.br";
</script>
<script src="/medway-hub-auth.js" data-auto></script>
```

#### Opção B: React Hook

```tsx
import { useHubAuth } from './useHubAuth';

export default function Page() {
  const { user, status } = useHubAuth('https://hub.medway.com.br');
  if (status === 'loading') return <Spinner />;
  if (status === 'unauthenticated') return null;
  return <div>Olá, {user.email}!</div>;
}
```

#### Opção C: Next.js Middleware (validação offline)

Copie `exports/middleware.ts` para a raiz do projeto externo. Configure:

```env
HUB_BASE_URL=https://hub.medway.com.br
SSO_SECRET=<mesmo SSO_SECRET do Hub>
```

---

## Perfis de Usuário

| Role | Permissões |
|---|---|
| `admin` | CRUD de projetos + usuários, acesso ao painel admin |
| `editor` | Adicionar/editar projetos |
| `viewer` | Apenas visualizar o catálogo |

---

## Categorias de Especialidade

| Especialidade | Cor |
|---|---|
| Medical Clinic | `#407EC9` |
| Surgery | `#00EFC8` |
| G.O. | `#AC145A` |
| Pediatrics | `#FFB81C` |
| Preventive | `#3B3FB6` |

---

## Design System

O arquivo `medway-theme.css` contém todas as CSS variables do design system Medway e pode ser usado em outros projetos:

```css
@import url('https://hub.medway.com.br/medway-theme.css');
```

---

## Segurança

- Senhas com `bcryptjs` (salt rounds: 12)
- Rate limiting: 5 tentativas de login/minuto por e-mail
- Tokens SSO expiram em 15 minutos
- Rotas protegidas por middleware NextAuth
- Painel admin com guard adicional por role
- Headers de segurança configurados em `next.config.mjs`
- CORS em `/api/sso/verify` para permitir chamadas cross-origin dos projetos embedados

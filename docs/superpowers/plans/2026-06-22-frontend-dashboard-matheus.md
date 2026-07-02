# Plano de Trabalho — Matheus

> **Para Matheus**: este é o seu plano individual. Você é o líder, faz o scaffold sozinho antes de todo mundo começar, e depois cuida de 3 widgets Fase 1, 2 widgets v2 mockados, e a Fase 3 (seletor de período) que rola só depois que Laura e M4 terminarem.
>
> Use checkboxes (`- [ ]`) pra acompanhar progresso.

**Sua branch**: `matheus`

**Spec de referência**: `docs/superpowers/specs/2026-06-22-frontend-dashboard-design.md`

**Tech stack**: Vite + React 19 + Tailwind CSS v4 + Recharts. JavaScript puro.

**Pré-requisito de desenvolvimento**: backend rodando em `http://localhost:5000` com banco `auth_analytics` populado pelo dump.

---

## Setup inicial da branch

> Você é o primeiro a começar. Cria a branch `matheus` a partir de `development`:

```bash
git checkout development
git pull
git checkout -b matheus
```

---

# FASE 0 — Scaffold (você sozinho)

> Nenhum outro dev começa antes do scaffold mergear em `development`. Depois do merge, comunica no grupo.

## Tarefa 0.1: Instalar Recharts

- [ ] **Passo 1**: rodar na raiz do projeto

```bash
npm install recharts
```

- [ ] **Passo 2**: commit

```bash
git add package.json package-lock.json
git commit -m "chore: adiciona recharts"
```

---

## Tarefa 0.2: Criar `src/lib/api.js`

- [ ] **Passo 1**: criar pasta `src/lib/` e o arquivo `src/lib/api.js`:

```js
const BASE_URL = '/api'

class ApiError extends Error {
  constructor(message, status) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })

  if (!res.ok) {
    throw new ApiError(`Erro ${res.status}: ${res.statusText}`, res.status)
  }

  return res.json()
}

export const api = {
  get:  (path)       => request(path),
  post: (path, body) => request(path, { method: 'POST', body: JSON.stringify(body) }),
}
```

- [ ] **Passo 2**: commit

```bash
git add src/lib/api.js
git commit -m "feat: cria cliente HTTP centralizado em lib/api"
```

---

## Tarefa 0.3: Criar `src/components/ui/LoadingSpinner.jsx`

- [ ] **Passo 1**: criar pasta `src/components/ui/` e o arquivo:

```jsx
export function LoadingSpinner({ size = 'md' }) {
  const sizes = { sm: 'w-4 h-4', md: 'w-6 h-6', lg: 'w-8 h-8' }
  return (
    <div className="flex items-center justify-center py-8">
      <div className={`${sizes[size]} border-2 border-blue-500 border-t-transparent rounded-full animate-spin`} />
    </div>
  )
}
```

- [ ] **Passo 2**: commit

```bash
git add src/components/ui/LoadingSpinner.jsx
git commit -m "feat: cria componente LoadingSpinner"
```

---

## Tarefa 0.4: Criar `src/components/ui/ErrorState.jsx`

- [ ] **Passo 1**: criar arquivo:

```jsx
export function ErrorState({ message }) {
  return (
    <div className="flex flex-col items-center justify-center py-8 gap-2">
      <span className="text-2xl">⚠️</span>
      <p className="text-sm text-red-400 font-medium">Falha ao carregar dados</p>
      {message && <p className="text-xs text-gray-500">{message}</p>}
    </div>
  )
}
```

- [ ] **Passo 2**: commit

```bash
git add src/components/ui/ErrorState.jsx
git commit -m "feat: cria componente ErrorState"
```

---

## Tarefa 0.5: Criar `src/components/ui/ChartCard.jsx`

- [ ] **Passo 1**: criar arquivo:

```jsx
import { LoadingSpinner } from './LoadingSpinner'
import { ErrorState } from './ErrorState'

export function ChartCard({ title, loading, error, children }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
      <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
        {title}
      </h3>
      {loading && <LoadingSpinner />}
      {error && <ErrorState message={error} />}
      {!loading && !error && children}
    </div>
  )
}
```

- [ ] **Passo 2**: commit

```bash
git add src/components/ui/ChartCard.jsx
git commit -m "feat: cria wrapper ChartCard"
```

---

## Tarefa 0.6: Mover `KpiCard` e `StatBar` pra `ui/` e remover duplicação

- [ ] **Passo 1**: mover arquivos existentes

```bash
git mv src/components/KpiCard.jsx src/components/ui/KpiCard.jsx
git mv src/components/StatBar.jsx src/components/ui/StatBar.jsx
```

- [ ] **Passo 2**: remover `src/components/RatioCard.jsx` (será substituído pelo widget `RatiosCard`)

```bash
git rm src/components/RatioCard.jsx
```

- [ ] **Passo 3**: commit

```bash
git commit -m "refactor: move KpiCard e StatBar para components/ui"
```

---

## Tarefa 0.7: Refatorar `useKpis` pra usar `lib/api`

- [ ] **Passo 1**: substituir o conteúdo de `src/hooks/useKpis.js`:

```js
import { useState, useEffect } from 'react'
import { api } from '../lib/api'

export function useKpis() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false

    api.get('/dashboard/kpis')
      .then(result => { if (!cancelled) setData(result) })
      .catch(err =>    { if (!cancelled) setError(err.message) })
      .finally(() =>   { if (!cancelled) setLoading(false) })

    return () => { cancelled = true }
  }, [])

  return { data, loading, error }
}
```

> Este hook serve de **padrão de referência** para todos os outros que Laura e M4 vão criar.

- [ ] **Passo 2**: commit

```bash
git add src/hooks/useKpis.js
git commit -m "refactor: useKpis usa cliente api centralizado"
```

---

## Tarefa 0.8: Criar `useUserRisk` (compartilhado com M4)

> Este hook precisa existir em `development` ANTES do M4 começar o widget `UserRiskDistribution`.

- [ ] **Passo 1**: criar `src/hooks/useUserRisk.js` seguindo o mesmo padrão do `useKpis`, apenas trocando o endpoint para `/dashboard/user-risk`.

- [ ] **Passo 2**: commit

```bash
git add src/hooks/useUserRisk.js
git commit -m "feat: cria hook useUserRisk"
```

---

## Tarefa 0.9: Criar os 13 placeholders de widget

- [ ] **Passo 1**: criar pasta `src/components/widgets/` e, para cada widget abaixo, criar um arquivo `.jsx` com este template (trocando `NomeDoWidget`):

```jsx
// src/components/widgets/NomeDoWidget.jsx
export function NomeDoWidget() {
  return (
    <div className="border border-dashed border-gray-700 rounded-xl p-4 text-center">
      <p className="text-xs text-gray-500">NomeDoWidget (TODO)</p>
    </div>
  )
}
```

- [ ] **Passo 2**: criar os 13 arquivos:
  - `KpisRow.jsx`
  - `RatiosCard.jsx`
  - `UserRiskTable.jsx`
  - `UserRiskDistribution.jsx`
  - `DailyLoginsChart.jsx`
  - `TopUsersChart.jsx`
  - `TopComputersChart.jsx`
  - `FailedLoginsKpi.jsx`
  - `OutOfPatternKpi.jsx`
  - `FailedLoginsChart.jsx`
  - `AnomalyTypesChart.jsx`
  - `AccessHeatmap.jsx`
  - `RequestsByIpChart.jsx`

- [ ] **Passo 3**: commit

```bash
git add src/components/widgets/
git commit -m "feat: cria placeholders dos 13 widgets"
```

---

## Tarefa 0.10: Refatorar `Dashboard.jsx` com layout final

- [ ] **Passo 1**: substituir todo o conteúdo de `src/components/Dashboard.jsx`:

```jsx
import { KpisRow } from './widgets/KpisRow'
import { RatiosCard } from './widgets/RatiosCard'
import { UserRiskDistribution } from './widgets/UserRiskDistribution'
import { FailedLoginsKpi } from './widgets/FailedLoginsKpi'
import { OutOfPatternKpi } from './widgets/OutOfPatternKpi'
import { FailedLoginsChart } from './widgets/FailedLoginsChart'
import { AnomalyTypesChart } from './widgets/AnomalyTypesChart'
import { AccessHeatmap } from './widgets/AccessHeatmap'
import { RequestsByIpChart } from './widgets/RequestsByIpChart'
import { DailyLoginsChart } from './widgets/DailyLoginsChart'
import { TopUsersChart } from './widgets/TopUsersChart'
import { TopComputersChart } from './widgets/TopComputersChart'
import { UserRiskTable } from './widgets/UserRiskTable'

function SectionHeader({ children }) {
  return (
    <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-4 mt-8">
      {children}
    </h2>
  )
}

export function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">

      <header className="border-b border-gray-800 px-8 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-white">SecOps Watch</h1>
          <p className="text-xs text-gray-500">Dashboard de segurança</p>
        </div>
        <div className="flex items-center gap-2">
          {['24h', '7d', '30d'].map(t => (
            <button
              key={t}
              className="text-xs px-3 py-1.5 rounded-lg border border-gray-700 text-gray-400 hover:border-blue-500 hover:text-blue-400 transition-colors"
            >
              {t}
            </button>
          ))}
        </div>
      </header>

      <main className="p-8 max-w-[1600px] mx-auto">

        <SectionHeader>Visão Geral</SectionHeader>
        <KpisRow />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
          <RatiosCard />
          <UserRiskDistribution />
        </div>

        <SectionHeader>Sinais de Risco</SectionHeader>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <FailedLoginsKpi />
          <OutOfPatternKpi />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
          <FailedLoginsChart />
          <AnomalyTypesChart />
        </div>
        <div className="mt-4">
          <AccessHeatmap />
        </div>
        <div className="mt-4">
          <RequestsByIpChart />
        </div>

        <SectionHeader>Atividade</SectionHeader>
        <DailyLoginsChart />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
          <TopUsersChart />
          <TopComputersChart />
        </div>

        <SectionHeader>Detalhamento</SectionHeader>
        <UserRiskTable />

      </main>
    </div>
  )
}
```

- [ ] **Passo 2**: validar visualmente

```bash
npm run dev
```

Confirmar: header + 4 seções com nomes + 13 caixas tracejadas.

- [ ] **Passo 3**: commit

```bash
git add src/components/Dashboard.jsx
git commit -m "feat: scaffold completo do Dashboard com todos os slots"
```

---

## Tarefa 0.11: Subir scaffold pra `development` e `main`

- [ ] **Passo 1**: push

```bash
git push origin matheus
```

- [ ] **Passo 2**: merge em `development`

```bash
git checkout development
git pull
git merge matheus
git push origin development
```

- [ ] **Passo 3**: validar em `development` (`npm run dev`)

- [ ] **Passo 4**: merge em `main`

```bash
git checkout main
git pull
git merge development
git push origin main
```

- [ ] **Passo 5**: **comunicar Laura e M4** que o scaffold está em `main` e que podem criar suas branches e começar.

---

# FASE 1 — Seus widgets com dados reais

> Volta pra branch `matheus`:
>
> ```bash
> git checkout matheus
> git merge development
> ```

## Padrões já implementados (consulta rápida)

| Para que serve | Onde está |
|---|---|
| Cliente HTTP | `src/lib/api.js` |
| Padrão de hook | `src/hooks/useKpis.js` |
| Wrapper de gráfico | `src/components/ui/ChartCard.jsx` |
| Card de KPI | `src/components/ui/KpiCard.jsx` |
| Barra de stat | `src/components/ui/StatBar.jsx` |
| Spinner | `src/components/ui/LoadingSpinner.jsx` |
| Estado de erro | `src/components/ui/ErrorState.jsx` |

---

## Tarefa M1: `KpisRow`

**Arquivo**: `src/components/widgets/KpisRow.jsx`

**Dado**: hook `useKpis` (já existe).
**Endpoint**: `GET /api/dashboard/kpis`.
**Shape**: `{ total_logins, total_users, total_computers, period_days, avg_logins_per_day }`.

**O que renderizar**: 4 cards lado a lado usando `<KpiCard>` de `ui/`:
- Total de logins
- Usuários únicos
- Computadores ativos
- Média de logins/dia

Visual: ver layout no spec, seção 5.

**Notas**:
- A implementação anterior desses 4 cards estava no `Dashboard.jsx` original — pode consultar via git history.
- Função `fmt()` (1.5K, 1.5M) é útil — pode duplicar dentro do widget ou criar `src/lib/format.js` (opcional).

**Passos**:
- [ ] Implementar
- [ ] Validar com backend rodando — 4 cards mostram números reais
- [ ] Validar erro — parar backend, ver `<ErrorState>`
- [ ] Commit: `feat: widget KpisRow com dados reais`

---

## Tarefa M2: `RatiosCard`

**Arquivo**: `src/components/widgets/RatiosCard.jsx`

**Dado**: hook `useKpis` (mesmo do M1).

**O que renderizar**: card único dentro de `<ChartCard title="Índices calculados">` com:
- 3 linhas de razões calculadas:
  - Computadores por usuário: `total_computers / total_users`
  - Logins por usuário/dia: `avg_logins_per_day / total_users`
  - Logins por computador/dia: `avg_logins_per_day / total_computers`
- Abaixo, 3 `<StatBar>` mostrando proporção visual (média diária, computadores, usuários).

**Notas**: visual original está no git history do `Dashboard.jsx` na seção "Ratios".

**Passos**:
- [ ] Implementar
- [ ] Validar
- [ ] Commit: `feat: widget RatiosCard`

---

## Tarefa M3: `UserRiskTable`

**Arquivo**: `src/components/widgets/UserRiskTable.jsx`

**Dado**: hook `useUserRisk` (criado no scaffold).
**Endpoint**: `GET /api/dashboard/user-risk`.
**Shape**: `[{ user_id, login_count, unique_computers, risk_level, risk_score }, ...]`.

**O que renderizar**: tabela dentro de `<ChartCard title="Ranking de usuários por risco">` com colunas:
- Usuário (`user_id`)
- Severidade (badge colorido: Crítico=vermelho, Alto=laranja, Médio=amarelo, Baixo=azul)
- Score de risco (barra de progresso 0–100 com cor conforme score)
- Logins (`login_count`)
- Computadores (`unique_computers`)

Ordenar por `risk_score` desc.

**Notas**:
- Peça mais complexa visualmente.
- Crie 2 sub-componentes auxiliares (`SeverityBadge`, `ScoreBar`) **inline no mesmo arquivo**, sem virar arquivos separados.
- Tabela responsiva: envolver em `<div className="overflow-x-auto">`.

**Passos**:
- [ ] Implementar
- [ ] Validar — tabela com badges coloridos, ordenada por score
- [ ] Commit: `feat: widget UserRiskTable`

---

# FASE 2 — Seus widgets v2 (mockados)

> Pode fazer em paralelo com Fase 1.

## Padrão de widget mockado

```jsx
// TODO v2: substituir por hook <NomeDoHook> quando endpoint existir
// Endpoint planejado: GET /api/dashboard/<rota-planejada>
// Depende de: tabela login_events
const MOCK_DATA = { /* copiar do spec seção 7 */ }

export function NomeDoWidget() {
  const data = MOCK_DATA
  // ...render normal
}
```

---

## Tarefa M-v1: `FailedLoginsKpi`

**Arquivo**: `src/components/widgets/FailedLoginsKpi.jsx`
**Mock**: spec seção 7, `FailedLoginsKpi`.
**Endpoint planejado**: `GET /api/dashboard/failed-logins-rate`.

**O que renderizar**: card com accent vermelho. Mostrar:
- Label: "Taxa de falha de autenticação"
- Valor grande: `failure_rate` em percentual (26.1%)
- Delta: `+12.3% vs média 13.8%`
- Meta: `Meta: <5%`

**Notas**: pode usar `<KpiCard>` ou implementar inline.

**Passos**:
- [ ] Implementar
- [ ] Validar
- [ ] Commit: `feat: widget FailedLoginsKpi (mock v2)`

---

## Tarefa M-v2: `OutOfPatternKpi`

**Arquivo**: `src/components/widgets/OutOfPatternKpi.jsx`
**Mock**: spec seção 7, `OutOfPatternKpi`.
**Endpoint planejado**: `GET /api/dashboard/out-of-pattern`.

**O que renderizar**: card com accent âmbar:
- Label: "Acessos fora do padrão"
- Valor: `out_of_pattern_count` (412)
- Sub: `35.9% do total`
- Meta: `Meta: <10%`

**Passos**:
- [ ] Implementar
- [ ] Validar
- [ ] Commit: `feat: widget OutOfPatternKpi (mock v2)`

---

## Tarefa M-merge: Subir seu trabalho pra `development`

- [ ] Push e merge
```bash
git push origin matheus
git checkout development
git pull
git merge matheus
git push origin development
```

---

# FASE 3 — Seletor de período (você sozinho, depois de tudo)

> Só começa **depois** que Laura e M4 mergearam seus widgets em `main`.

> ✅ **IMPLEMENTADA (2026-07-01)** — P1 a P4 concluídas na branch `matheus` (lint + build passando). Duas adaptações em relação ao código planejado, exigidas pelo ESLint do projeto:
>
> 1. **Hooks (P4)**: a regra `react-hooks/set-state-in-effect` proíbe `setLoading(true)`/`setError(null)` síncronos dentro do `useEffect`. Os hooks guardam `{ period, data, error }` num único estado e **derivam** `loading` comparando o `period` do resultado com o atual — mesmo comportamento, sem setState no corpo do effect.
> 2. **PeriodContext (P1)**: `export function usePeriod` num arquivo que também exporta componente viola `react-refresh/only-export-components`; recebeu um `eslint-disable-next-line` pontual (padrão comum em arquivos de context).
>
> Falta apenas a **P5** (push + merge para `development` → `main`). Atenção: no remoto a branch de integração chama-se `origin/developer` (não `development`).

## Tarefa P1: Criar `PeriodContext`

- [ ] **Passo 1**: criar `src/contexts/PeriodContext.jsx`:

```jsx
import { createContext, useContext, useState } from 'react'

const PeriodContext = createContext(null)

export function PeriodProvider({ children }) {
  const [period, setPeriod] = useState('7d')
  return (
    <PeriodContext.Provider value={{ period, setPeriod }}>
      {children}
    </PeriodContext.Provider>
  )
}

export function usePeriod() {
  const ctx = useContext(PeriodContext)
  if (!ctx) throw new Error('usePeriod deve estar dentro de <PeriodProvider>')
  return ctx
}
```

- [ ] **Passo 2**: commit

```bash
git add src/contexts/PeriodContext.jsx
git commit -m "feat: cria PeriodContext"
```

---

## Tarefa P2: Criar `PeriodSelector`

- [ ] **Passo 1**: criar `src/components/ui/PeriodSelector.jsx`:

```jsx
import { usePeriod } from '../../contexts/PeriodContext'

const OPTIONS = ['24h', '7d', '30d']

export function PeriodSelector() {
  const { period, setPeriod } = usePeriod()

  return (
    <div className="flex items-center gap-2">
      {OPTIONS.map(opt => (
        <button
          key={opt}
          onClick={() => setPeriod(opt)}
          className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${
            period === opt
              ? 'border-blue-500 text-blue-400 bg-blue-500/10'
              : 'border-gray-700 text-gray-400 hover:border-blue-500 hover:text-blue-400'
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  )
}
```

- [ ] **Passo 2**: commit

```bash
git add src/components/ui/PeriodSelector.jsx
git commit -m "feat: cria PeriodSelector"
```

---

## Tarefa P3: Integrar `PeriodProvider` + `PeriodSelector` no `Dashboard.jsx`

- [ ] **Passo 1**: editar `src/components/Dashboard.jsx`:

1. Adicionar imports no topo:
```jsx
import { PeriodProvider } from '../contexts/PeriodContext'
import { PeriodSelector } from './ui/PeriodSelector'
```

2. Envolver todo o retorno em `<PeriodProvider>`:
```jsx
return (
  <PeriodProvider>
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {/* ... resto igual ... */}
    </div>
  </PeriodProvider>
)
```

3. No header, substituir o array `{['24h', '7d', '30d'].map(...)}` por:
```jsx
<PeriodSelector />
```

- [ ] **Passo 2**: validar — botões destacam o selecionado em azul

- [ ] **Passo 3**: commit

```bash
git add src/components/Dashboard.jsx
git commit -m "feat: integra PeriodSelector no Dashboard"
```

---

## Tarefa P4: Refatorar cada hook pra usar `period`

> Só funciona end-to-end se o backend aceitar `?period=24h|7d|30d`. Se backend não estiver pronto, a UI funciona mas dados não mudam — tudo bem, fica preparado.

- [ ] **Passo 1**: para cada hook (`useKpis`, `useUserRisk`, `useDailyLogins`, `useTopUsers`), aplicar mesmo padrão. (`useTopComputers` foi descartado em 2026-07-01 junto com o widget `TopComputersChart` — não existe.) Exemplo:

```js
import { useState, useEffect } from 'react'
import { api } from '../lib/api'
import { usePeriod } from '../contexts/PeriodContext'   // ← (1)

export function useKpis() {
  const { period } = usePeriod()                         // ← (2)
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    api.get(`/dashboard/kpis?period=${period}`)          // ← (3)
      .then(result => { if (!cancelled) setData(result) })
      .catch(err =>    { if (!cancelled) setError(err.message) })
      .finally(() =>   { if (!cancelled) setLoading(false) })

    return () => { cancelled = true }
  }, [period])                                            // ← (4)

  return { data, loading, error }
}
```

Repetir pros 5 hooks, trocando só o endpoint.

- [ ] **Passo 2**: validar — clicar nos botões `[24h] [7d] [30d]` e ver widgets re-fetcharem (spinners aparecem)

- [ ] **Passo 3**: commit

```bash
git add src/hooks/
git commit -m "feat: hooks usam period do Context"
```

---

## Tarefa P5: Merge final pra `main`

- [ ] Push e merge

```bash
git push origin matheus
git checkout development
git pull
git merge matheus
git push origin development

npm run dev   # validação manual

git checkout main
git pull
git merge development
git push origin main
```

**Projeto completo.**

---

# Sua checklist final

- [ ] Scaffold em `main` e comunicado ao grupo
- [ ] `KpisRow` com dados reais
- [ ] `RatiosCard` com dados reais
- [ ] `UserRiskTable` com dados reais
- [ ] `FailedLoginsKpi` com mock + comentário `TODO v2`
- [ ] `OutOfPatternKpi` com mock + comentário `TODO v2`
- [ ] Seus widgets mergeados em `development`
- [x] Laura e M4 terminaram → começar Fase 3 (`TopComputersChart` da Laura foi descartado)
- [x] `PeriodContext` + `PeriodSelector` + refator de hooks (2026-07-01)
- [ ] Merge final pra `main`

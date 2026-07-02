# SecOps Watch — Design do Frontend

**Data**: 2026-06-22
**Autor**: Matheus Anthony (líder)
**Time**: Matheus Anthony, Laura, M4
**Escopo**: Apenas frontend (Vite + React 19 + Tailwind v4)

---

## 1. Contexto

O projeto SecOps Watch é um dashboard de segurança operacional desenvolvido como trabalho de faculdade. O backend (Flask + PostgreSQL) já existe parcialmente, com banco populado por um dump (`auth_analytics_dump_v1.backup`) contendo 5 tabelas agregadas. O frontend foi prototipado no Lovable e exportado para um repositório GitHub. A partir de agora, todo o desenvolvimento ocorre no GitHub — Lovable foi descartado.

### Estado inicial do frontend

- **Stack**: Vite + React 19 + Tailwind CSS v4, JavaScript puro
- **Estrutura atual**: `App.jsx` renderiza diretamente `<Dashboard/>` (sem router)
- **Único hook existente**: `useKpis` (fetch direto, sem cliente HTTP padronizado)
- **Único widget funcional**: 4 KPIs simples do `dashboard_kpis`
- **Vite proxy configurado**: `/api` → `http://localhost:5000`
- **Sem libs de gráfico instaladas**

### Estado inicial do backend

- 5 tabelas no banco `auth_analytics`: `dashboard_kpis`, `daily_login_trend`, `top_users`, `top_computers`, `user_risk`
- 1 endpoint parcial: `GET /api/dashboard/kpis`
- Outros arquivos de rota (`computers.py`, `users.py`) vazios

---

## 2. Objetivo

Construir um dashboard único e completo de segurança, dividindo o trabalho em **mini componentes** (widgets) que podem ser delegados individualmente para cada membro do time. O dashboard final tem 13 widgets organizados em 4 seções temáticas.

### Estratégia em duas fases

**Fase 1 (este spec)**: 7 widgets consumindo dados reais do backend + 6 widgets v2 com dados mockados. Tela visualmente completa.

**Fase 2 (futuro, fora do escopo deste spec)**: enriquecer o banco com nova tabela `login_events` (timestamp, success/fail, ip, user_id, computer_id) e substituir mocks dos widgets v2 por hooks reais.

---

## 3. Arquitetura

### Princípios

- **Single-page dashboard**: sem router, sem multi-página. Tudo renderiza em uma tela.
- **Sem sidebar**: removida do design original — não fazia sentido em uma tela única.
- **Mini componentes (widgets)**: cada bloco do dashboard é um componente isolado em arquivo próprio, com seu próprio hook de dados.
- **Um hook por widget**: isolamento total. Cada dev é dono ponta a ponta do seu pedaço (UI + dados).
- **`Dashboard.jsx` frozen após scaffold**: define só o layout/grid e importa widgets. Não é editado por ninguém depois do scaffold inicial (exceto ajustes de layout aprovados pelo líder).

### Estrutura de pastas

```
src/
├── App.jsx                      # só renderiza <Dashboard/>
├── main.jsx
├── index.css
│
├── components/
│   ├── Dashboard.jsx            # layout + slots dos widgets (frozen após scaffold)
│   │
│   ├── ui/                      # componentes genéricos reutilizáveis
│   │   ├── KpiCard.jsx
│   │   ├── StatBar.jsx
│   │   ├── ChartCard.jsx        # wrapper visual padrão (título + loading/error + corpo)
│   │   ├── LoadingSpinner.jsx
│   │   └── ErrorState.jsx
│   │
│   └── widgets/                 # 1 arquivo por bloco, dono = 1 dev
│       ├── KpisRow.jsx
│       ├── RatiosCard.jsx
│       ├── UserRiskTable.jsx
│       ├── UserRiskDistribution.jsx
│       ├── DailyLoginsChart.jsx
│       ├── TopUsersChart.jsx
│       ├── TopComputersChart.jsx
│       ├── FailedLoginsKpi.jsx          # v2 mockado
│       ├── OutOfPatternKpi.jsx          # v2 mockado
│       ├── FailedLoginsChart.jsx        # v2 mockado
│       ├── AnomalyTypesChart.jsx        # v2 mockado
│       ├── AccessHeatmap.jsx            # v2 mockado
│       └── RequestsByIpChart.jsx        # v2 mockado
│
├── hooks/                       # 1 hook por widget Fase 1
│   ├── useKpis.js               # refatorado pra usar lib/api.js
│   ├── useDailyLogins.js
│   ├── useTopUsers.js
│   ├── useTopComputers.js
│   └── useUserRisk.js           # compartilhado: UserRiskTable + UserRiskDistribution
│
└── lib/
    └── api.js                   # cliente fetch único, baseURL, ApiError
```

---

## 4. Mapeamento de widgets, hooks, endpoints e donos

### Fase 1 — dados reais

| # | Widget | Hook | Endpoint | Tabela origem | Tipo visual | Dono |
|---|---|---|---|---|---|---|
| 1 | `KpisRow` | `useKpis` (refator) | `GET /api/dashboard/kpis` | `dashboard_kpis` | 4 cards | **Matheus** |
| 2 | `RatiosCard` | reaproveita `useKpis` | (reaproveita) | derivado | Card com 3 linhas calculadas | **Matheus** |
| 3 | `UserRiskTable` | `useUserRisk` (cria) | `GET /api/dashboard/user-risk` | `user_risk` | Tabela ranking + badges | **Matheus** |
| 4 | `DailyLoginsChart` | `useDailyLogins` | `GET /api/dashboard/daily-logins` | `daily_login_trend` | Linha (Recharts) | **Laura** |
| 5 | ~~`TopComputersChart`~~ | ~~`useTopComputers`~~ | — | — | ❌ **Descartado (2026-07-01)** — não será implementado | **Laura** |
| 6 | `TopUsersChart` | `useTopUsers` | `GET /api/dashboard/top-users` | `top_users` | Barras horizontais | **M4** |
| 7 | `UserRiskDistribution` | `useRiskSummary` | `GET /api/dashboard/risk-summary` | `user_risk` | Donut severidade | **M4** |

### Fase 2 — mockados (Fase 1 entrega com mock + comentário de migração)

> **Status**: Ainda não é possível realizar esses hooks, pois ainda não tem no banco de dados e nem rota no backend. Dependem da criação da tabela `login_events` (timestamp, success/fail, ip, user_id, computer_id) na Fase 2 do backend.

| # | Widget | Endpoint planejado | Dono |
|---|---|---|---|
| 8 | `FailedLoginsKpi` | `GET /api/dashboard/failed-logins-rate` | **Matheus** |
| 9 | `OutOfPatternKpi` | `GET /api/dashboard/out-of-pattern` | **Matheus** |
| 10 | `FailedLoginsChart` | `GET /api/dashboard/failed-logins-trend?days=7` | **Laura** |
| 11 | `AccessHeatmap` | `GET /api/dashboard/access-heatmap?days=7` | **Laura** |
| 12 | `RequestsByIpChart` | `GET /api/dashboard/top-ips?limit=10` | **M4** |
| 13 | `AnomalyTypesChart` | `GET /api/dashboard/anomaly-types` | **M4** |

### Distribuição final por pessoa

| Pessoa | Fase 1 | Fase 2 (mock) | Total |
|---|---|---|---|
| **Matheus** | KpisRow, RatiosCard, UserRiskTable | FailedLoginsKpi, OutOfPatternKpi | 5 |
| **Laura** | DailyLoginsChart, TopComputersChart | FailedLoginsChart, AccessHeatmap | 4 |
| **M4** | TopUsersChart, UserRiskDistribution | RequestsByIpChart, AnomalyTypesChart | 4 |

### Dependência cruzada

O hook `useUserRisk` é usado por **Matheus** (`UserRiskTable`) e **M4** (`UserRiskDistribution`). Matheus cria o hook em uma das suas primeiras subidas para `development`. M4 só começa o `UserRiskDistribution` depois que o hook estiver disponível.

---

## 5. Layout do Dashboard

Quatro seções temáticas em layout vertical, largura máxima de 1600px:

```
═══ HEADER ═══
SecOps Watch — Dashboard | [24h] [7d] [30d]

═══ VISÃO GERAL ═══
<KpisRow/>                           (full width, 4 cards)
<RatiosCard/> | <UserRiskDistribution/>   (2 colunas)

═══ SINAIS DE RISCO (v2 — mockado) ═══
<FailedLoginsKpi/> | <OutOfPatternKpi/>      (2 colunas)
<FailedLoginsChart/> | <AnomalyTypesChart/>  (2 colunas)
<AccessHeatmap/>                              (full width)
<RequestsByIpChart/>                          (full width)

═══ ATIVIDADE ═══
<DailyLoginsChart/>                           (full width)
<TopUsersChart/> | <TopComputersChart/>       (2 colunas)

═══ DETALHAMENTO ═══
<UserRiskTable/>                              (full width)
```

### Header

- Título "SecOps Watch" + subtítulo "Dashboard de segurança"
- Seletor de período `[24h] [7d] [30d]` (apenas visual nesta fase — sem ação no backend ainda)

### Notas de layout

- `max-w-[1600px] mx-auto`: evita esticar em monitores muito largos
- `AccessHeatmap` e `DailyLoginsChart` em full-width: precisam de eixo X longo
- `UserRiskTable` no final, full-width: detalhamento que o usuário consulta após bater olho nos gráficos
- `SectionHeader` é helper inline em `Dashboard.jsx` (não vira arquivo separado)

---

## 6. Camada de dados

### `src/lib/api.js`

Cliente HTTP centralizado. Todos os hooks importam daqui. Trocar implementação (axios, ky, etc) muda apenas este arquivo.

```js
const BASE_URL = '/api'  // Vite proxy → http://localhost:5000

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
  get:  (path)        => request(path),
  post: (path, body)  => request(path, { method: 'POST', body: JSON.stringify(body) }),
}
```

### Padrão de hook (modelo único)

Todos os hooks retornam `{ data, loading, error }`. Modelo:

```js
import { useState, useEffect } from 'react'
import { api } from '../lib/api'

export function useDailyLogins() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false

    api.get('/dashboard/daily-logins')
      .then(result => { if (!cancelled) setData(result) })
      .catch(err =>    { if (!cancelled) setError(err.message) })
      .finally(() =>   { if (!cancelled) setLoading(false) })

    return () => { cancelled = true }
  }, [])

  return { data, loading, error }
}
```

### Padrão de widget (consumo do hook + ChartCard)

```jsx
import { useDailyLogins } from '../../hooks/useDailyLogins'
import { ChartCard } from '../ui/ChartCard'

export function DailyLoginsChart() {
  const { data, loading, error } = useDailyLogins()

  return (
    <ChartCard title="Tendência de logins diários" loading={loading} error={error}>
      <ResponsiveContainer ...>
        <LineChart data={data}>...</LineChart>
      </ResponsiveContainer>
    </ChartCard>
  )
}
```

### `ChartCard` (wrapper visual padrão)

Evita que cada widget reimplemente "título + loading + error + container":

```jsx
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

### Refator obrigatório de `useKpis`

Hoje usa `fetch` cru. Deve migrar para o padrão acima (importando `api` de `lib/api.js`). Parte da PR de scaffold do Matheus.

### Limpeza obrigatória de duplicação

O código atual tem `KpiCard` e `StatBar` definidos **duas vezes**: inline em `components/Dashboard.jsx` e também em arquivos próprios (`components/KpiCard.jsx`, `components/StatBar.jsx`). O scaffold deve:

1. Mover `KpiCard.jsx` e `StatBar.jsx` para `components/ui/`
2. Remover as versões inline de `Dashboard.jsx`
3. Garantir que `KpisRow.jsx` e `RatiosCard.jsx` importem de `components/ui/`

### Padrão de widget v2 (mockado)

Widgets v2 não usam hook. Mock no topo do arquivo + comentário de migração:

```jsx
// src/components/widgets/FailedLoginsKpi.jsx

// TODO v2: substituir por hook useFailedLoginsKpi quando endpoint existir
// Endpoint planejado: GET /api/dashboard/failed-logins-rate
// Depende de: tabela login_events
const MOCK_DATA = {
  failure_rate: 0.261,
  baseline_rate: 0.138,
  delta_vs_baseline: 0.123,
  target_rate: 0.05,
}

export function FailedLoginsKpi() {
  // const { data, loading, error } = useFailedLoginsKpi()  ← descomenta na Fase 2
  const data = MOCK_DATA
  // ...render
}
```

Migração Fase 2 = trocar 2 linhas.

---

## 7. Mocks dos widgets v2

### `FailedLoginsKpi`
```js
const MOCK_DATA = {
  failure_rate: 0.261,        // 26.1%
  baseline_rate: 0.138,       // 13.8% média histórica
  delta_vs_baseline: 0.123,   // +12.3pp
  target_rate: 0.05           // meta <5%
}
```

### `OutOfPatternKpi`
```js
const MOCK_DATA = {
  out_of_pattern_count: 412,
  out_of_pattern_pct: 0.359,
  target_pct: 0.10
}
```

### `FailedLoginsChart`
```js
const MOCK_DATA = [
  { day: '16/06', failures: 32 },
  { day: '17/06', failures: 45 },
  { day: '18/06', failures: 28 },
  { day: '19/06', failures: 67 },
  { day: '20/06', failures: 89 },
  { day: '21/06', failures: 54 },
  { day: '22/06', failures: 156 }
]
```

### `RequestsByIpChart`
```js
const MOCK_DATA = [
  { ip: '10.0.10.73', requests: 1247 },
  { ip: '10.0.32.54', requests: 982 },
  { ip: '10.0.45.12', requests: 743 },
  { ip: '10.0.18.91', requests: 612 },
  { ip: '10.0.27.33', requests: 488 },
  { ip: '10.0.51.07', requests: 392 },
  { ip: '10.0.62.18', requests: 274 }
]
```

### `AccessHeatmap` (matriz 7d × 24h)
```js
// 168 células (7 dias × 24h), cada uma { day, hour, count, is_anomaly }
const MOCK_DATA = Array.from({ length: 7 }, (_, day) =>
  Array.from({ length: 24 }, (_, hour) => {
    const isWorkHour = hour >= 8 && hour <= 18 && day >= 1 && day <= 5
    const baseCount = isWorkHour
      ? 80 + Math.floor(Math.random() * 80)
      : Math.floor(Math.random() * 20)
    const isAnomaly = !isWorkHour && baseCount > 15
    return { day, hour, count: baseCount, is_anomaly: isAnomaly }
  })
).flat()
```

### `AnomalyTypesChart`
```js
const MOCK_DATA = [
  { type: 'Falha de login',        count: 218 },
  { type: 'IP desconhecido',       count: 145 },
  { type: 'Excesso de tentativas', count: 92 },
  { type: 'Horário incomum',       count: 67 },
  { type: 'Dispositivo novo',      count: 41 }
]
```

---

## 8. Contratos com o backend (Fase 1)

> ⚠️ **Corrigido em 2026-07-01**: o backend (`secops_watch_api`) foi implementado com rotas diferentes das planejadas originalmente aqui (que devolviam 404 no frontend). A tabela abaixo reflete as **rotas reais**. Diferenças relevantes:
> - Usuários ficam sob o prefixo `/api/users/` (blueprint próprio), não `/api/dashboard/`
> - `risk_level` tem **3 níveis em inglês** (`HIGH`/`MEDIUM`/`LOW`), não 4 em português — os widgets traduzem para exibição
> - `/api/users/risk` é **paginado** (default `limit=50`, máx. 200); por isso o `UserRiskDistribution` usa `/api/dashboard/risk-summary` (contagem exata por nível no banco inteiro) via hook próprio `useRiskSummary`, em vez de agregar no cliente

| Endpoint | Tabela | Resposta |
|---|---|---|
| `GET /api/dashboard/kpis` | `dashboard_kpis` | `{ total_logins, total_users, total_computers, period_days, avg_logins_per_day }` |
| `GET /api/dashboard/login-trend` | `daily_login_trend` | `[{ day, login_count, is_low_volume_day }, ...]` |
| `GET /api/dashboard/risk-summary` | `user_risk` | `{ HIGH, MEDIUM, LOW, total }` (contagem por nível) |
| `GET /api/users/top?limit=10` | `top_users` | `[{ user_id, login_count, unique_computers }, ...]` |
| `GET /api/users/risk?limit=50` | `user_risk` | `[{ user_id, login_count, unique_computers, risk_level, risk_score }, ...]` ordenado por `risk_score` desc |
| ~~`GET /api/computers/top`~~ | `top_computers` | não consumido — widget `TopComputersChart` descartado |

---

## 9. Workflow de Git

### Branches

- `main` — estável, código que funciona
- `development` — integração e testes do trabalho de todo mundo junto
- `matheus`, `laura`, `m4` — uma por pessoa, criada **depois do scaffold**

### Fluxo

```
1. Matheus faz o scaffold em uma branch própria, sobe para development, valida,
   e então merge em main (mesmo fluxo dos widgets, descrito abaixo)

2. Cada pessoa cria sua branch a partir de development:
        git checkout development
        git pull
        git checkout -b laura

3. Cada um trabalha nos widgets atribuídos na sua branch

4. Periodicamente faz merge da branch pra development
   (subir cedo e com frequência — não esperar terminar tudo)

5. Testa tudo junto em development

6. Quando development tá sólido → merge em main
```

### Recomendação solta

Antes de começar o dia, cada um atualiza sua branch com `development`:
```
git checkout <minha-branch>
git merge development
```
Evita conflitos grandes na hora de subir.

### Bibliotecas a instalar (parte do scaffold)

```
npm install recharts
```

Recharts é a única dependência nova.

---

## 10. Definição de "pronto"

### Por widget

- [ ] Arquivo em `src/components/widgets/<Nome>.jsx`
- [ ] Hook em `src/hooks/use<Nome>.js` (Fase 1) **ou** mock + comentário `TODO v2` (Fase 2)
- [ ] Usa `<ChartCard title=...>` como wrapper (ou `<KpiCard>` para cards)
- [ ] Trata os 3 estados: loading, error, sem dados
- [ ] Importado e renderizado em `Dashboard.jsx`
- [ ] `npm run dev` sobe sem erro no console

### Fase 1 concluída

- Os 13 widgets renderizam (7 com dado real, 6 com mock)
- `npm run dev` no frontend + `python app.py` no backend = dashboard funcional em `localhost:5173`
- Tudo está em `main`

---

## 11. Seletor de período (24h / 7d / 30d)

Na Fase 1 o seletor de período no header é **apenas visual** — os botões não disparam nenhuma ação. Implementar o filtro funcional exige refatorar todos os hooks pra aceitarem `period` como argumento, criar um `PeriodContext` global e ajustar o `Dashboard.jsx`, além de depender do backend aceitar `?period=24h|7d|30d` em cada endpoint (o que só é viável após a Fase 2 do backend criar a tabela `login_events`).

**Plano**: depois que **todos os widgets dos três devs estiverem finalizados**, Matheus implementa a feature de período sozinho, de uma vez só. Isso evita que 3 pessoas mexam no `Dashboard.jsx` e nos hooks ao mesmo tempo, simplifica a coordenação e mantém a arquitetura central sob uma única visão.

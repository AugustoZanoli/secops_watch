# Plano de Trabalho — M4

> **Para M4**: este é o seu plano individual. Você fica com 2 widgets de Fase 1 (com dados reais) e 2 widgets de Fase 2 (mockados). No total: 4 widgets.
>
> Use checkboxes (`- [ ]`) pra acompanhar progresso.

**Sua branch**: `m4`

**Spec de referência**: `docs/superpowers/specs/2026-06-22-frontend-dashboard-design.md`

**Tech stack**: Vite + React 19 + Tailwind CSS v4 + Recharts. JavaScript puro.

**Pré-requisito**: backend rodando em `http://localhost:5000` com banco `auth_analytics` populado pelo dump. Sem isso, os widgets Fase 1 mostram erro (que é o comportamento esperado — valida o tratamento de erro).

---

## ⚠️ Aguardar antes de começar

Você só começa **depois** que Matheus comunicar que o **scaffold está em `main`**. Sem isso, os arquivos e padrões que você precisa não existem ainda.

Quando ele avisar:

```bash
git checkout development
git pull
git checkout -b m4
npm install
```

---

## Padrões já implementados (leia antes de codar)

Antes de começar qualquer widget, abra estes arquivos pra entender os padrões que **já existem** e que você vai reutilizar:

| Para que serve | Onde está | Como usar |
|---|---|---|
| Cliente HTTP | `src/lib/api.js` | `import { api } from '../../lib/api'` → `api.get('/dashboard/...')` |
| Padrão de hook | `src/hooks/useKpis.js` | Copiar a estrutura e trocar o endpoint. Sempre retorna `{ data, loading, error }`. |
| Hook compartilhado | `src/hooks/useUserRisk.js` | **Não criar de novo** — Matheus já criou no scaffold. Você importa e usa. |
| Wrapper de gráfico | `src/components/ui/ChartCard.jsx` | `<ChartCard title="..." loading={loading} error={error}>{children}</ChartCard>` |
| Spinner | `src/components/ui/LoadingSpinner.jsx` | já vem dentro do `ChartCard` |
| Estado de erro | `src/components/ui/ErrorState.jsx` | já vem dentro do `ChartCard` |

**Regra**: nunca redefinir nada que já existe nesses arquivos. Se faltar algo, conversar com Matheus antes de criar.

---

# FASE 1 — Seus widgets com dados reais

## Tarefa M4-1: `useTopUsers` + `TopUsersChart`

**Arquivos**:
- Criar: `src/hooks/useTopUsers.js`
- Modificar: `src/components/widgets/TopUsersChart.jsx` (substituir o placeholder)

**Padrão do hook**: copiar `src/hooks/useKpis.js` e trocar:
- Nome da função para `useTopUsers`
- Endpoint para `'/dashboard/top-users'`

**Dado retornado pelo endpoint**: array `[{ user_id, login_count, unique_computers }, ...]`.

**O que renderizar**: gráfico de **barras horizontais** dentro de `<ChartCard title="Top usuários por logins">`. Top 10 itens (use `data.slice(0, 10)`):
- Eixo Y = `user_id`
- Eixo X = `login_count`

**Componentes Recharts**: `BarChart` com `layout="vertical"`, `Bar`, `XAxis`, `YAxis`, `CartesianGrid`, `Tooltip`, `ResponsiveContainer`.

**Notas**:
- Pra barras horizontais: `<BarChart layout="vertical">` + `<XAxis type="number">` + `<YAxis type="category" dataKey="user_id">`.
- Cor sugerida: azul `#3b82f6`.
- Bordas arredondadas só do lado direito: `radius={[0, 4, 4, 0]}` na `<Bar>`.
- A Laura está fazendo um `TopComputersChart` com estrutura idêntica — vale alinhar com ela pra que o visual fique consistente (mesma altura, cores parecidas mas distintas).

**Passos**:
- [ ] Criar o hook
- [ ] Implementar o widget
- [ ] Validar visualmente (`npm run dev`)
- [ ] Validar erro — parar o backend, ver `<ErrorState>`
- [ ] Commit: `feat: widget TopUsersChart`

---

## Tarefa M4-2: `UserRiskDistribution`

> ⚠️ **DEPENDÊNCIA**: o hook `useUserRisk` deve estar disponível em `development`. Foi criado pelo Matheus no scaffold, então normalmente já está. Confirme antes de começar:
>
> ```bash
> git checkout m4
> git merge development
> ls src/hooks/useUserRisk.js
> ```
>
> Se o arquivo não existir, espera Matheus mergear o scaffold.

**Arquivo**: `src/components/widgets/UserRiskDistribution.jsx`

**Dado**: hook `useUserRisk` (já existe). Importar de `'../../hooks/useUserRisk'`.
**Endpoint que ele consome**: `GET /api/dashboard/user-risk`.
**Shape**: array `[{ user_id, login_count, unique_computers, risk_level, risk_score }, ...]`.

**O que renderizar**: donut chart (Recharts `PieChart` com `innerRadius > 0`) dentro de `<ChartCard title="Distribuição por severidade">`. 4 fatias coloridas:
- Crítico: vermelho `#ef4444`
- Alto: laranja `#f97316`
- Médio: amarelo `#eab308`
- Baixo: azul `#3b82f6`

**Notas**:
- Você precisa **agregar** os dados antes de passar pro chart: contar quantos usuários em cada `risk_level`. Crie uma função helper inline tipo:
  ```js
  function aggregateByLevel(users) {
    const counts = {}
    for (const u of users) {
      counts[u.risk_level] = (counts[u.risk_level] || 0) + 1
    }
    return Object.entries(counts).map(([level, value]) => ({ level, value }))
  }
  ```
- Componentes Recharts: `PieChart`, `Pie`, `Cell`, `Tooltip`, `Legend`, `ResponsiveContainer`.
- Para donut: `innerRadius={60} outerRadius={90}`.
- Passar cor por fatia via `<Cell key={i} fill={COLORS[entry.level]} />`.

**Passos**:
- [ ] Implementar
- [ ] Validar — donut com 4 fatias aparece na seção "Visão Geral"
- [ ] Commit: `feat: widget UserRiskDistribution`

---

# FASE 2 — Seus widgets v2 (mockados)

> Pode fazer em paralelo com Fase 1 — não dependem de backend.

## Padrão de widget mockado

Widgets v2 **não criam hook**. O mock vai no topo do arquivo:

```jsx
// TODO v2: substituir por hook <NomeDoHook> quando endpoint existir
// Endpoint planejado: GET /api/dashboard/<rota-planejada>
// Depende de: tabela login_events
const MOCK_DATA = { /* ou [] */ }

export function NomeDoWidget() {
  const data = MOCK_DATA
  // ...render normal usando data
}
```

Os mocks de cada widget estão no spec, **seção 7**. Copiar de lá literalmente.

---

## Tarefa M4-v1: `RequestsByIpChart`

**Arquivo**: `src/components/widgets/RequestsByIpChart.jsx`
**Mock**: spec seção 7, `RequestsByIpChart`.
**Endpoint planejado**: `GET /api/dashboard/top-ips?limit=10`.

**O que renderizar**: gráfico de **barras horizontais** (mesma estrutura do seu `TopUsersChart`) mas:
- Título: "Top IPs por requisições"
- Eixo Y = `ip`
- Eixo X = `requests`
- Cor sugerida: ciano `#06b6d4`

**Notas**: copia/cola do seu `TopUsersChart` e adapta. Como não tem fetch, não precisa de `loading`/`error` na `<ChartCard>`.

**Passos**:
- [ ] Implementar
- [ ] Validar — barras ciano aparecem na seção "Sinais de Risco"
- [ ] Commit: `feat: widget RequestsByIpChart (mock v2)`

---

## Tarefa M4-v2: `AnomalyTypesChart`

**Arquivo**: `src/components/widgets/AnomalyTypesChart.jsx`
**Mock**: spec seção 7, `AnomalyTypesChart`.
**Endpoint planejado**: `GET /api/dashboard/anomaly-types`.

**O que renderizar**: gráfico de **barras verticais** (diferente das horizontais — sem `layout="vertical"`) dentro de `<ChartCard title="Tipos de anomalia">`:
- Eixo X = `type` (rotacionar labels com `angle={-20}` porque são textos longos, e `textAnchor="end"`, `height={60}`)
- Eixo Y = `count`
- Cor sugerida: âmbar `#f59e0b`
- Bordas arredondadas só no topo: `radius={[4, 4, 0, 0]}` na `<Bar>`

**Componentes Recharts**: `BarChart`, `Bar`, `XAxis`, `YAxis`, `CartesianGrid`, `Tooltip`, `ResponsiveContainer`.

**Passos**:
- [ ] Implementar
- [ ] Validar — barras âmbar aparecem na seção "Sinais de Risco"
- [ ] Commit: `feat: widget AnomalyTypesChart (mock v2)`

---

## Tarefa M4-merge: Subir seu trabalho pra `development`

Quando todos os 4 widgets estiverem prontos:

- [ ] **Passo 1**: garantir branch atualizada

```bash
git checkout m4
git merge development   # se outros mergearam enquanto isso
```

- [ ] **Passo 2**: push + merge

```bash
git push origin m4
git checkout development
git pull
git merge m4
git push origin development
```

- [ ] **Passo 3**: avisar Matheus que seu trabalho está em `development`

---

# Sua checklist final

- [ ] Esperou scaffold em `main` antes de começar
- [ ] `useTopUsers` + `TopUsersChart` com dados reais
- [ ] `UserRiskDistribution` com dados reais (usando `useUserRisk` do scaffold)
- [ ] `RequestsByIpChart` com mock + comentário `TODO v2`
- [ ] `AnomalyTypesChart` com mock + comentário `TODO v2`
- [ ] Tudo mergeado em `development`
- [ ] Avisou Matheus

---

# Dicas práticas

- **Sempre rode `npm run dev` antes de commitar** pra garantir que nada quebrou.
- **Console limpo**: nada de `console.log` esquecido nem warning vermelho.
- **Atualizar com `development` todo dia** antes de começar a trabalhar:
  ```bash
  git checkout m4
  git merge development
  ```
- **Travou em algo do Recharts?** Doc tá em https://recharts.org/en-US/examples. Tem exemplo pra cada tipo de gráfico.
- **Dúvida sobre o spec?** Pergunta pro Matheus, não tenta adivinhar.

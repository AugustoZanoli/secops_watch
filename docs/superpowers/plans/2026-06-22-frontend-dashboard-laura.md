# Plano de Trabalho — Laura

> **Para Laura**: este é o seu plano individual. Você fica com 2 widgets de Fase 1 (com dados reais) e 2 widgets de Fase 2 (mockados). No total: 4 widgets.
>
> Use checkboxes (`- [ ]`) pra acompanhar progresso.

**Sua branch**: `laura`

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
git checkout -b laura
npm install
```

---

## Padrões já implementados (leia antes de codar)

Antes de começar qualquer widget, abra estes arquivos pra entender os padrões que **já existem** e que você vai reutilizar:

| Para que serve | Onde está | Como usar |
|---|---|---|
| Cliente HTTP | `src/lib/api.js` | `import { api } from '../../lib/api'` → `api.get('/dashboard/...')` |
| Padrão de hook | `src/hooks/useKpis.js` | Copiar a estrutura e trocar o endpoint. Sempre retorna `{ data, loading, error }`. |
| Wrapper de gráfico | `src/components/ui/ChartCard.jsx` | `<ChartCard title="..." loading={loading} error={error}>{children}</ChartCard>` |
| Spinner | `src/components/ui/LoadingSpinner.jsx` | já vem dentro do `ChartCard` |
| Estado de erro | `src/components/ui/ErrorState.jsx` | já vem dentro do `ChartCard` |

**Regra**: nunca redefinir nada que já existe nesses arquivos. Se faltar algo, conversar com Matheus antes de criar.

---

# FASE 1 — Seus widgets com dados reais

## Tarefa L1: `useDailyLogins` + `DailyLoginsChart`

**Arquivos**:
- Criar: `src/hooks/useDailyLogins.js`
- Modificar: `src/components/widgets/DailyLoginsChart.jsx` (substituir o placeholder)

**Padrão do hook**: copiar `src/hooks/useKpis.js` e trocar:
- Nome da função para `useDailyLogins`
- Endpoint para `'/dashboard/daily-logins'`

**Dado retornado pelo endpoint**: array `[{ day, login_count, is_low_volume_day }, ...]`.

**O que renderizar**: gráfico de linha (Recharts) dentro de `<ChartCard title="Tendência de logins diários">`:
- Eixo X = `day`
- Eixo Y = `login_count`

**Componentes Recharts**: `LineChart`, `Line`, `XAxis`, `YAxis`, `CartesianGrid`, `Tooltip`, `ResponsiveContainer`.

**Notas**:
- Doc oficial Recharts: https://recharts.org/en-US/api/LineChart
- Tema escuro: usar `stroke="#6b7280"` nos eixos e `stroke="#3b82f6"` (azul) na linha.
- Altura sugerida: `height={280}` no `ResponsiveContainer`.
- Tooltip customizado: passar `contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '8px' }}`.

**Passos**:
- [ ] Criar o hook `src/hooks/useDailyLogins.js`
- [ ] Implementar o widget
- [ ] Validar visualmente (`npm run dev`) — gráfico de linha aparece na seção "Atividade"
- [ ] Validar erro — parar o backend, ver `<ErrorState>` dentro do `ChartCard`
- [ ] Commit: `feat: widget DailyLoginsChart`

---

## Tarefa L2: `useTopComputers` + `TopComputersChart`

**Arquivos**:
- Criar: `src/hooks/useTopComputers.js`
- Modificar: `src/components/widgets/TopComputersChart.jsx`

**Padrão do hook**: copiar `useKpis`, endpoint `'/dashboard/top-computers'`.

**Dado**: array `[{ computer_id, access_count, unique_users }, ...]`.

**O que renderizar**: gráfico de **barras horizontais** dentro de `<ChartCard title="Top computadores por acessos">`. Top 10 itens (use `data.slice(0, 10)`):
- Eixo Y = `computer_id`
- Eixo X = `access_count`

**Componentes Recharts**: `BarChart` com `layout="vertical"`, `Bar`, `XAxis`, `YAxis`, etc.

**Notas**:
- Pra barras horizontais: `<BarChart layout="vertical">` + `<XAxis type="number">` + `<YAxis type="category" dataKey="computer_id">`.
- Cor sugerida: roxo `#a855f7`.
- Bordas arredondadas só do lado direito: `radius={[0, 4, 4, 0]}` na `<Bar>`.

**Passos**:
- [ ] Criar hook
- [ ] Implementar widget
- [ ] Validar — barras horizontais aparecem
- [ ] Commit: `feat: widget TopComputersChart`

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

## Tarefa L-v1: `FailedLoginsChart`

**Arquivo**: `src/components/widgets/FailedLoginsChart.jsx`
**Mock**: spec seção 7, `FailedLoginsChart`.
**Endpoint planejado**: `GET /api/dashboard/failed-logins-trend?days=7`.

**O que renderizar**: gráfico de linha (mesma estrutura do seu `DailyLoginsChart`) mas:
- Título: "Evolução de falhas de login (7d)"
- Cor da linha: vermelho `#ef4444`
- `dataKey` = `failures` (em vez de `login_count`)

**Notas**: copia/cola do seu `DailyLoginsChart` e adapta. Como não tem fetch, não precisa de `loading`/`error` na `<ChartCard>`.

**Passos**:
- [ ] Implementar
- [ ] Validar — linha vermelha aparece na seção "Sinais de Risco"
- [ ] Commit: `feat: widget FailedLoginsChart (mock v2)`

---

## Tarefa L-v2: `AccessHeatmap`

**Arquivo**: `src/components/widgets/AccessHeatmap.jsx`
**Mock**: spec seção 7, `AccessHeatmap` (gera 168 células via `Array.from`).
**Endpoint planejado**: `GET /api/dashboard/access-heatmap?days=7`.

**O que renderizar**: grid de 7 linhas (dias) × 24 colunas (horas), cada célula colorida conforme `count`:
- `count` baixo: azul escuro
- `count` médio: azul médio
- `count` alto: azul claro
- `is_anomaly: true`: laranja `#f97316`

Adicionar:
- Header com horas no topo (mostrar a cada 3h pra não poluir)
- Labels dos dias na esquerda (Dom/Seg/Ter/Qua/Qui/Sex/Sáb)
- Tooltip ao passar o mouse (usar atributo `title=` no `div` — não precisa de lib)
- Legenda embaixo com as 4 cores

**Notas**:
- ⚠️ Este é o widget **mais complexo** visualmente — reserve um tempo. Estimativa: ~70 linhas.
- Recharts **não tem heatmap nativo** — você vai construir com divs e Tailwind.
- Helper de cor: função `cellColor(count, isAnomaly)` que retorna a classe Tailwind certa.
- Use `<div className="overflow-x-auto">` pra rolar horizontal se a tela for pequena.

**Estrutura sugerida** (decida você os detalhes):
```jsx
<ChartCard title="Mapa de calor de acessos (7d × 24h)">
  <div className="overflow-x-auto">
    {/* Header com horas */}
    <div className="flex gap-1 ml-10 mb-1">
      {Array.from({ length: 24 }, (_, h) => (...))}
    </div>
    {/* Linhas (1 por dia) */}
    {DAYS.map((dayLabel, dayIdx) => (
      <div key={dayIdx} className="flex items-center gap-1 mb-1">
        <span className="...">{dayLabel}</span>
        {Array.from({ length: 24 }, (_, hour) => {
          const cell = MOCK_DATA.find(c => c.day === dayIdx && c.hour === hour)
          return <div className={`w-5 h-5 rounded-sm ${cellColor(cell.count, cell.is_anomaly)}`} title={...} />
        })}
      </div>
    ))}
    {/* Legenda */}
  </div>
</ChartCard>
```

**Passos**:
- [ ] Implementar
- [ ] Validar — grid 7×24 colorido com tooltip no hover
- [ ] Commit: `feat: widget AccessHeatmap (mock v2)`

---

## Tarefa L-merge: Subir seu trabalho pra `development`

Quando todos os 4 widgets estiverem prontos:

- [ ] **Passo 1**: garantir branch atualizada

```bash
git checkout laura
git merge development   # se outros mergearam enquanto isso
```

- [ ] **Passo 2**: push + merge

```bash
git push origin laura
git checkout development
git pull
git merge laura
git push origin development
```

- [ ] **Passo 3**: avisar Matheus que seu trabalho está em `development`

---

# Sua checklist final

- [ ] Esperou scaffold em `main` antes de começar
- [ ] `useDailyLogins` + `DailyLoginsChart` com dados reais
- [ ] `useTopComputers` + `TopComputersChart` com dados reais
- [ ] `FailedLoginsChart` com mock + comentário `TODO v2`
- [ ] `AccessHeatmap` com mock + comentário `TODO v2`
- [ ] Tudo mergeado em `development`
- [ ] Avisou Matheus

---

# Dicas práticas

- **Sempre rode `npm run dev` antes de commitar** pra garantir que nada quebrou.
- **Console limpo**: nada de `console.log` esquecido nem warning vermelho.
- **Atualizar com `development` todo dia** antes de começar a trabalhar:
  ```bash
  git checkout laura
  git merge development
  ```
- **Travou em algo do Recharts?** Doc tá em https://recharts.org/en-US/examples. Tem exemplo pra cada tipo de gráfico.
- **Dúvida sobre o spec?** Pergunta pro Matheus, não tenta adivinhar.

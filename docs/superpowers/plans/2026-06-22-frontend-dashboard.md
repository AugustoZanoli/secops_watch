# Plano de Implementação — SecOps Watch Frontend (Overview)

> Este arquivo é o **índice geral**. Cada dev tem seu plano individual em um arquivo separado. Use este overview pra entender a coordenação entre as 3 pessoas. Use o plano individual pra ver suas tarefas.

**Spec de referência**: `docs/superpowers/specs/2026-06-22-frontend-dashboard-design.md`

**Tech stack**: Vite + React 19 + Tailwind CSS v4 + Recharts. JavaScript puro.

---

## Planos individuais

| Pessoa | Arquivo | Resumo |
|---|---|---|
| Matheus | [`2026-06-22-frontend-dashboard-matheus.md`](./2026-06-22-frontend-dashboard-matheus.md) | Scaffold + 3 widgets Fase 1 + 2 widgets v2 + Fase 3 (período) |
| Laura | [`2026-06-22-frontend-dashboard-laura.md`](./2026-06-22-frontend-dashboard-laura.md) | 2 widgets Fase 1 + 2 widgets v2 |
| M4 | [`2026-06-22-frontend-dashboard-m4.md`](./2026-06-22-frontend-dashboard-m4.md) | 2 widgets Fase 1 + 2 widgets v2 |

---

## Ordem de execução

```
1. Matheus faz a Fase 0 (Scaffold) sozinho
   ├── Cria api.js, ChartCard, KpiCard, StatBar, hooks base
   ├── Cria os 13 placeholders de widget
   ├── Reescreve Dashboard.jsx com layout final
   └── Merge em development → main → comunica grupo
              │
              ▼
2. Laura e M4 criam suas branches a partir de development
   e começam Fase 1 + Fase 2 em paralelo
              │
              ▼ (depende de cada um terminar seus widgets)
              │
3. Matheus também faz seus widgets Fase 1 + Fase 2 em paralelo
              │
              ▼ (todos terminaram, tudo está em development → main)
              │
4. Matheus faz Fase 3 (seletor de período) sozinho
              │
              ▼
5. Merge final pra main → projeto completo
```

---

## Dependências entre devs

Existem apenas duas dependências cruzadas:

1. **Todo mundo depende do scaffold (Fase 0)** — Laura e M4 só começam depois do scaffold em `main`.
2. **M4 depende do hook `useUserRisk` criado pelo Matheus** no scaffold. Normalmente já estará pronto quando M4 começar, mas se não, esperar.

---

## Divisão de widgets

| # | Widget | Dono | Tipo |
|---|---|---|---|
| 1 | `KpisRow` | Matheus | Fase 1 |
| 2 | `RatiosCard` | Matheus | Fase 1 |
| 3 | `UserRiskTable` | Matheus | Fase 1 |
| 4 | `DailyLoginsChart` | Laura | Fase 1 |
| 5 | `TopComputersChart` | Laura | Fase 1 |
| 6 | `TopUsersChart` | M4 | Fase 1 |
| 7 | `UserRiskDistribution` | M4 | Fase 1 |
| 8 | `FailedLoginsKpi` | Matheus | Fase 2 (mock) |
| 9 | `OutOfPatternKpi` | Matheus | Fase 2 (mock) |
| 10 | `FailedLoginsChart` | Laura | Fase 2 (mock) |
| 11 | `AccessHeatmap` | Laura | Fase 2 (mock) |
| 12 | `RequestsByIpChart` | M4 | Fase 2 (mock) |
| 13 | `AnomalyTypesChart` | M4 | Fase 2 (mock) |

---

## Workflow de Git

- `main` — estável
- `development` — integração (todo mundo merge aqui antes de main)
- `matheus`, `laura`, `m4` — branches individuais

Cada dev periodicamente atualiza sua branch com `development` (`git merge development` na sua branch) pra evitar conflitos grandes.

---

## Definição de "Pronto"

### Por widget
- Arquivo em `src/components/widgets/<Nome>.jsx`
- Hook em `src/hooks/use<Nome>.js` (Fase 1) **ou** mock + comentário `TODO v2` (Fase 2)
- Usa `<ChartCard title=...>` como wrapper (ou `<KpiCard>` para cards)
- Trata loading / error / sem dados
- `npm run dev` sobe sem erro no console

### Projeto concluído
- Os 13 widgets renderizam (7 com dado real, 6 com mock)
- Seletor de período funciona end-to-end (se backend Fase 2 estiver pronto)
- `npm run dev` no front + `python app.py` no back = dashboard funcional em `localhost:5173`
- Tudo está em `main`

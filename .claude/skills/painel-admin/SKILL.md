---
description: Ponto de entrada para qualquer tarefa no SignallQ Admin — classifica entre código e análise de dados, define qualidade mínima de mocks e checklist de entrega.
---

## Quando usar

Antes de iniciar qualquer tarefa no `SignallQ Admin/` — seja implementar feature, corrigir bug, gerar mock ou interpretar dados do app.

## Quem usa

Felipe — obrigatório como primeiro passo em qualquer task do admin panel.

---

## CP0 — Classifique antes de agir

| Tipo | Critério | Fluxo |
|---|---|---|
| **CÓDIGO** | Nova aba, componente, serviço, bugfix, layout, autenticação | Felipe → (Marcelo se ≤5 arquivos) → Gema |
| **ANÁLISE** | Interpretar dados de Play Console, Firebase, crash, retenção, custo IA | Felipe direto |
| **MOCK** | Gerar ou ajustar dados simulados realistas | Felipe → validar distribuição → Gema |
| **DEPLOY** | Build + Cloudflare Pages | `/cloudflare-pages-check` → Felipe → build → deploy |
| **DOCS** | Changelog, sumário de release, documentação do painel | Nina direto |

**Regra de escopo:** se a task tocar Android ou PWA, pare. Acione Camilo ou Renan. Felipe não sai de `SignallQ Admin/`.

---

## Passos — Task de código

1. **Verificar se já existe** — acione Marcelo para localizar componente, serviço ou tipo antes de criar.
2. **Consultar design system** — `/linka-design` para tokens de cor, espaçamento e tipografia antes de implementar qualquer UI.
3. **Checar contratos** — se a task altera uma interface de serviço ou mock, mapear impacto em todos os consumers.
4. **Implementar** — Felipe ou Marcelo (se ≤5 arquivos, sem mudança de contrato).
5. **Lint** — `npm run lint` obrigatório antes de qualquer entrega.
6. **Build** — `npm run build` obrigatório se a task toca componentes críticos ou contratos de dados.
7. **Revisar** — Gema antes de fechar.

### Checklist de qualidade de código

- [ ] Componente novo tem props explicitamente tipadas?
- [ ] Sem `any` no TypeScript?
- [ ] Sem lógica de negócio diretamente no JSX?
- [ ] Componente reutilizável foi verificado antes de ser duplicado?
- [ ] Cores e espaçamento via tokens Tailwind (sem valores hardcoded)?
- [ ] Ícones via Lucide React (`lucide-react`) — sem ícones SVG inline?
- [ ] Gráficos (Recharts) com eixos nomeados, legenda e unidade de medida?
- [ ] Estado de loading e estado vazio tratados?
- [ ] `npm run lint` sem erros?
- [ ] `npm run build` sem erros (se task crítica)?

---

## Passos — Task de análise de dados

1. **Identificar fonte** — de onde vêm os dados? Play Console, Firebase, mock, CSV fornecido pelo usuário?
2. **Verificar período** — o período analisado é representativo? Há sazonalidade relevante?
3. **Aplicar benchmarks** — comparar com referências de mercado (ver seção abaixo).
4. **Estruturar achados** — achado + contexto + implicação. Nunca achado solto.
5. **Documentar limitações** — o que os dados não permitem concluir.
6. **Recomendar ação** — ou indicar explicitamente que os dados não sustentam uma recomendação.

### Benchmarks de referência — apps mobile Brasil

| Métrica | Saudável | Atenção | Crítico |
|---|---|---|---|
| Retenção D1 | > 30% | 20–30% | < 20% |
| Retenção D7 | > 12% | 7–12% | < 7% |
| Retenção D30 | > 6% | 3–6% | < 3% |
| Crash rate | < 1% | 1–2% | > 2% |
| ANR rate | < 0.47% | 0.47–1% | > 1% |
| Rating médio | ≥ 4.0 | 3.5–3.9 | < 3.5 |
| Latência de IA (P95) | < 3s | 3–5s | > 5s |
| Conversion install | > 35% | 20–35% | < 20% |

---

## Passos — Geração de mock realista

Mocks ruins são pior que ausência de mock — induzem decisões erradas.

1. **Definir cohort** — qual é o tamanho realista da base de usuários do SignallQ agora? (early-stage: centenas a poucos milhares)
2. **Aplicar distribuição** — dados reais têm variância. Evitar séries perfeitamente lineares ou constantes.
3. **Respeitar sazonalidade** — uso de apps de rede tende a ser maior em dias úteis e horário comercial.
4. **Distribuição de SO** — Android Brasil: Android 10–13 concentram ~70% da base; Android 8/9 ainda relevantes.
5. **Distribuição de operadoras** — Claro, Vivo, TIM e Oi dominam; incluir MVNOs como ruído.
6. **Anomalias esperadas** — mocks sem nenhuma anomalia não refletem realidade. Incluir picos, quedas e outliers plausíveis.

### Checklist de qualidade de mock

- [ ] Valores dentro de distribuição plausível (não todos idênticos, não todos extremos)?
- [ ] Séries temporais com variância natural (não linear perfeita)?
- [ ] Crash rate, ANR e ratings condizentes com benchmarks de mercado?
- [ ] Dados de IA (tokens, latência, custo) proporcionais ao uso simulado?
- [ ] Distribuição de OS e operadoras reflete mercado brasileiro?
- [ ] Há pelo menos um outlier ou anomalia realista por série?
- [ ] Os dados não contradizem o que o app Android realmente faz?

---

## Estrutura do projeto — referência rápida

```
SignallQ Admin/
  src/
    features/         Abas do painel (overview, diagnostics, ai-cost, errors…)
    components/       Componentes reutilizáveis (MetricCard, DataTable, ChartCard…)
    services/         Camada de dados (retorna mock ou API futura)
    mocks/            Dados simulados centralizados
    integrations/     Adapters: Firebase, Google Play, App Store (futuros)
    types/            Tipos TypeScript compartilhados
    config/           Navegação e constantes
    auth/             LoginPage e lógica de autenticação
```

**Abas disponíveis:** Overview · Produto & Uso · Diagnósticos · Redes · Operadoras · IA & Custo · Erros · Versões · Configurações

**Stack:** React 19 · TypeScript · Vite · Tailwind CSS v4 · Recharts · Lucide React · Hash routing

---

## Output esperado

### Código
1. Arquivos alterados com caminhos reais em `SignallQ Admin/`
2. Contratos de dados — se mock ou tipo foi alterado
3. Resultado de lint e build
4. Riscos restantes

### Análise
1. Fonte dos dados
2. Achados (bullet points: achado + contexto + implicação)
3. Benchmarks aplicados
4. Recomendações
5. Limitações dos dados

---

## Limites

- Esta skill orienta, não implementa.
- Implementação e análise → Felipe (ou Marcelo para tasks pequenas sob supervisão de Felipe).
- Não cobre Android nem PWA — para essas plataformas, usar `/dev-linka`.
- Não substitui `/linka-design` para decisões de design system.
- Não substitui `/cloudflare-pages-check` para configurações de deploy.

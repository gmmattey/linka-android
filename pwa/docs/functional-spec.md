# Especificação Funcional por Tela

## Regras gerais

- Mobile-first.
- PT-BR.
- Sem chat livre como interface principal.
- Diagnóstico curto e acionável.
- Não inventar métrica.
- Mostrar limitações do navegador quando necessário.

## Landing Page

### Objetivo

Explicar o SignallQ e levar o usuário a iniciar um teste.

### Dados exibidos

- Nome SignallQ.
- Proposta: diagnosticar qualidade da conexão.
- Benefício claro.
- CTA principal: iniciar teste.
- Informação curta sobre versão web.

### Ações

- Iniciar teste.
- Ver privacidade/sobre.

## Home / Dashboard

### Objetivo

Dar acesso rápido ao teste e ao histórico.

### Dados exibidos

- Último resultado, se existir.
- CTA para novo teste.
- Atalho para histórico.
- Estado resumido da última conexão.

### Estados

- sem histórico;
- com histórico;
- erro ao carregar histórico.

## SpeedTest

### Objetivo

Executar medição web de conexão.

### Dados exibidos

- etapa atual do teste;
- progresso visual;
- métrica em andamento quando disponível;
- aviso de limitação web quando necessário.

### Ações

- iniciar;
- cancelar, se viável;
- tentar novamente após erro.

### Estados

- pronto para iniciar;
- medindo download;
- medindo latência;
- medindo upload, se disponível;
- erro parcial;
- erro total;
- concluído.

## Resultado do Diagnóstico

### Objetivo

Mostrar se a conexão está boa, ruim ou instável e o que fazer depois.

### Dados exibidos

- status geral;
- velocidade;
- estabilidade;
- download;
- upload, se medido;
- latência;
- jitter, se medido;
- resumo;
- até 3 ações recomendadas;
- limitações do teste.

### Estados

- diagnóstico local;
- diagnóstico IA;
- IA indisponível com fallback local;
- métricas parciais.

## Histórico

### Objetivo

Consultar testes anteriores salvos localmente.

### Dados exibidos

- data/hora;
- status geral;
- download;
- latência;
- estabilidade resumida.

### Estados

- vazio;
- carregando;
- lista;
- erro.

## Detalhe de Teste

### Objetivo

Mostrar resultado completo de um teste salvo.

### Dados exibidos

- métricas completas;
- diagnóstico;
- limitações;
- informações do browser;
- ações recomendadas.

## Ajustes mínimos

### Objetivo

Dar controle básico sem virar tela genérica inútil.

### Dados exibidos

- limpar histórico;
- informações de privacidade;
- versão do app.

### Fora do escopo

- perfil complexo;
- login;
- preferências avançadas sem uso real.

## Sobre / Privacidade

### Objetivo

Explicar limitações e privacidade da versão web.

### Conteúdo mínimo

- o que o PWA mede;
- o que o PWA não consegue medir;
- onde o histórico fica salvo;
- que dados podem ir para diagnóstico IA.

## Critérios de aceite gerais

- Toda tela tem estado vazio/erro quando aplicável.
- CTA principal é claro.
- Usuário entende o resultado em menos de 10 segundos.
- Métrica ausente aparece como não medida.
- Nenhuma tela depende de login no MVP.
- Nenhuma tela promete recurso nativo Android.

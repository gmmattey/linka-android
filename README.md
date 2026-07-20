# SignallQ

**Entenda sua conexão. Encontre o problema. Saiba o que fazer.**

O SignallQ é um ecossistema de produtos para diagnóstico de internet e redes. A proposta é transformar medições técnicas — que normalmente parecem um monte de números — em explicações claras, recomendações práticas e evidências que ajudam pessoas e profissionais a tomar decisões melhores.

O projeto nasceu no Brasil com foco em problemas reais de conectividade: Wi-Fi instável, velocidade abaixo do esperado, sinal fraco, latência, interferência, falhas na fibra, cobertura ruim e dificuldade para identificar a origem do problema.

## O ecossistema

### SignallQ

Produto voltado ao consumidor final.

Ajuda o usuário a avaliar a qualidade da conexão, entender o que está acontecendo e descobrir quais ações podem melhorar a experiência.

Entre as experiências previstas e em evolução estão:

- testes de velocidade, latência e estabilidade;
- análise de sinal Wi-Fi, rede móvel e conexão de fibra;
- diagnóstico em linguagem simples;
- recomendações práticas e contextualizadas;
- histórico de medições e comparação de resultados;
- ferramentas para investigar problemas de rede;
- geração e compartilhamento de resultados.

O objetivo não é apenas dizer que a internet está “boa” ou “ruim”, mas explicar **por que**, mostrar **onde pode estar o problema** e orientar **qual é o próximo passo**.

### SignallQ Pro

Produto separado, voltado a técnicos de informática, instaladores de redes, consultores, prestadores de serviço e pequenos provedores.

O SignallQ Pro transforma medições de conectividade em um fluxo profissional de atendimento, permitindo organizar clientes, locais, visitas, ambientes, evidências e resultados antes e depois de uma intervenção.

A visão do produto inclui:

- cadastro de clientes e locais atendidos;
- medições organizadas por visita e ambiente;
- fotos, observações e evidências técnicas;
- comparação antes e depois;
- histórico por cliente;
- relatórios profissionais personalizáveis;
- apoio à apresentação e venda do serviço realizado.

O Pro não é apenas uma versão com “mais botões”. Ele resolve outro problema: ajudar o profissional a transformar conhecimento técnico em um serviço organizado, demonstrável e valorizado pelo cliente.

### SignallQ Admin

Ambiente interno de operação e acompanhamento do ecossistema.

O Admin apoia a gestão de qualidade, versões, feedbacks, estabilidade e evolução dos produtos. Ele não é destinado ao consumidor final e não representa uma área pública de acesso.

A separação existe para manter responsabilidades claras:

| Produto | Público | Papel principal |
|---|---|---|
| **SignallQ** | Consumidores | Entender e melhorar a própria conexão |
| **SignallQ Pro** | Profissionais de redes e suporte | Executar atendimentos e gerar evidências e relatórios |
| **SignallQ Admin** | Operação interna | Acompanhar a saúde e a evolução dos produtos |

## Organização do repositório

O projeto é organizado como um **monorepositório modular**. Isso permite manter os produtos separados, com ciclos e experiências próprias, sem duplicar fundamentos técnicos que podem ser compartilhados com segurança.

A visão pública da estrutura é:

```text
/
├── android/
│   ├── app/        # aplicativo SignallQ para consumidores
│   ├── pro/        # aplicativo e módulos exclusivos do SignallQ Pro
│   ├── core/       # fundamentos reutilizáveis entre produtos Android
│   └── feature/    # funcionalidades modulares do aplicativo consumidor
├── SignallQ Admin/ # aplicação web interna e independente
├── integrations/  # pontos de integração com serviços externos
└── docs/           # documentação de produto e engenharia
```

Essa árvore é uma visão simplificada. A organização interna pode evoluir conforme os produtos amadurecem, mas a separação de responsabilidades deve permanecer:

- cada produto possui sua própria aplicação, navegação e experiência;
- funcionalidades são divididas em módulos menores, evitando aplicações monolíticas;
- componentes genéricos podem ser compartilhados;
- fluxos, regras e interfaces específicas permanecem no produto ao qual pertencem;
- o Admin opera de forma independente dos aplicativos Android.

## Compartilhamento de módulos

SignallQ e SignallQ Pro são aplicativos distintos, com identidade, público, instalação, versionamento e evolução próprios. Eles não são cópias um do outro, mas também não precisam reconstruir do zero tudo o que já foi validado.

O compartilhamento segue uma regra simples: **reutilizar a capacidade técnica; preservar a experiência e a regra de negócio de cada produto**.

### O que pode ser compartilhado

Quando um módulo é genérico, testável e não depende da experiência de um produto específico, ele pode atender aos dois aplicativos Android. Exemplos públicos incluem:

- fundamentos de conectividade e comunicação de rede;
- acesso seguro a recursos e permissões do aparelho;
- abstrações de telefonia e estado da conexão;
- preferências e armazenamento local genérico;
- motores de medição reutilizáveis, como o teste de velocidade;
- contratos e modelos comuns de diagnóstico;
- componentes básicos para geração de resultados e relatórios;
- ferramentas comuns de qualidade, testes e observabilidade.

### O que permanece separado

A reutilização não deve criar um aplicativo híbrido ou acoplar os produtos artificialmente. Permanecem separados:

- navegação, telas, textos e identidade visual de cada produto;
- fluxo do consumidor no SignallQ;
- clientes, visitas, ambientes, evidências e atendimento profissional no Pro;
- persistência de dados específica de cada experiência;
- regras comerciais, monetização e ciclo de lançamento;
- autenticação e recursos exclusivos do produto profissional;
- interfaces e ferramentas internas do Admin.

### Como os produtos se relacionam

| Camada | SignallQ | SignallQ Pro | SignallQ Admin |
|---|---|---|---|
| **Experiência e interface** | Própria para consumidores | Própria para profissionais | Própria para operação interna |
| **Medições de conectividade** | Utiliza módulos técnicos | Reutiliza módulos aplicáveis | Acompanha resultados operacionais autorizados |
| **Diagnóstico** | Orientado ao usuário final | Aplicado ao atendimento técnico | Acompanha qualidade e evolução, sem executar o fluxo dos apps |
| **Relatórios** | Resultado simples e compartilhável | Laudo profissional e evidências | Visões operacionais internas |
| **Código compartilhado** | Fundamentos Android reutilizáveis | Consome fundamentos compatíveis | Aplicação web independente; integração por contratos controlados |

O Admin não importa telas ou módulos Android. A relação com os aplicativos ocorre por interfaces controladas e dados necessários à operação, mantendo limites claros entre produto, plataforma e administração.

Esse modelo reduz duplicação, melhora a consistência das medições e permite corrigir ou evoluir uma capacidade comum sem transformar SignallQ e SignallQ Pro no mesmo produto.

## O que torna o SignallQ diferente

Muitas ferramentas mostram métricas. O SignallQ quer conectar essas métricas ao problema real do usuário.

Isso significa combinar medições, contexto e orientação para responder perguntas como:

- O problema está na operadora, no Wi-Fi ou no dispositivo?
- A velocidade contratada está chegando de forma útil?
- A rede está estável ou apenas teve um pico de velocidade?
- O sinal está fraco por distância, interferência ou configuração?
- Trocar de canal, frequência, posição do roteador ou equipamento pode ajudar?
- A intervenção técnica realmente melhorou o ambiente?

## Princípios do projeto

- **Clareza antes de tecnicismo:** resultados devem ser compreensíveis sem exigir conhecimento de redes.
- **Ação antes de diagnóstico vazio:** sempre que possível, o usuário deve sair com um próximo passo.
- **Medição com contexto:** um número isolado raramente conta a história completa.
- **Privacidade e responsabilidade:** dados e acessos devem ser tratados com o mínimo necessário.
- **Separação de produtos:** consumidor, profissional e operação interna possuem necessidades diferentes.
- **Reutilização sem acoplamento:** módulos comuns devem reduzir duplicação sem apagar os limites entre produtos.
- **Evolução baseada em evidências:** decisões de produto devem considerar testes, telemetria, feedback e uso real.

## Estado do projeto

O ecossistema está em desenvolvimento ativo. Funcionalidades, disponibilidade e escopo podem mudar conforme os produtos avançam em validação, testes e preparação para lançamento.

Este repositório concentra o desenvolvimento dos aplicativos Android SignallQ e SignallQ Pro, seus módulos compartilháveis e componentes relacionados. O SignallQ Admin permanece como aplicação interna independente dentro do mesmo repositório.

## Escopo público e segurança

Este README apresenta a visão pública do projeto. Por segurança e proteção do produto, ele não documenta credenciais, endpoints privados, regras proprietárias de diagnóstico, mecanismos internos de proteção, detalhes de implantação ou integrações restritas.

Relatos públicos também não devem incluir senhas, tokens, chaves, dados pessoais, endereços internos, arquivos de configuração privados ou informações de clientes.

## Colaboração e feedback

Sugestões, relatos de comportamento inesperado e propostas de melhoria podem ser registrados nas Issues do repositório, sem incluir informações sensíveis.

Ao relatar um problema, descreva o cenário, o comportamento esperado, o que aconteceu e, quando possível, o modelo do aparelho e a versão do Android.

---

**SignallQ** — conectividade explicada de um jeito que ajuda a agir.

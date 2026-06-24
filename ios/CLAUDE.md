# iOS SignallQ — Instruções para Agentes

## Projeto

SignallQ iOS — app nativo para iPhone/iPad de diagnóstico de conectividade.

## Status

Projeto futuro. Nenhum agente iOS existe hoje.

## Agente responsável

A definir. Antes de iniciar o desenvolvimento iOS, criar agente especializado com:
- Swift + SwiftUI
- Xcode e ferramentas de build iOS
- Firebase iOS SDK
- Paridade de diagnóstico com Android (WiFi, Fibra, Celular, DNS)

Registrar a criação do agente como issue no Linear e ADR em `docs_ai/decisions/`.

## Stack planejada

- Swift + SwiftUI
- Firebase iOS
- Cloudflare Worker (mesmo worker do Android: `linka-ai-diagnosis-worker`)

## Skills futuras (não criar ainda)

- `ios-platform-rules` — quirks de iOS, permissões, sandbox
- `swiftui-check` — revisão de código SwiftUI

## Rastreamento

Linear: projeto `SignallQ` (SIG), buscar issues com label `area:ios` ou equivalente.

## Restrições

- Não criar código de produto sem agente iOS definido e aprovado pelo Luiz
- Não criar skills iOS sem alinhamento com Claudete
- Não alterar package Android `io.veloo.app` — o iOS terá bundle ID próprio a definir
